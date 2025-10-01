import * as fs from "fs";
import * as path from "path";
import {Matches, Players} from './types';

type Tournament = {
  matches: Matches;
  players: Players;
};

type CurrentMatch = {
  id: string;
  playerA: string;
  playerB: string;
  points: number[];
} | null;

type ComputeWinner = {
  setsA: number;
  setsB: number;
  playerA: string;
  playerB: string;
};


/**
 * Compute winner best of 3 sets (first to 2 sets wins).
 */

function computeWinner({
  setsA,
  setsB,
  playerA,
  playerB,
}: ComputeWinner): string | null {
  const WINNER_MIN_POINTS = 2;

  if (setsA >= WINNER_MIN_POINTS) {
    return playerA;
  }
  if (setsB >= WINNER_MIN_POINTS) {
    return playerB;
  }

  return null;
}

/**
 * Compute sets won given a sequence of game wins
 */
function computeSets(gamesA: number[], gamesB: number[]): [number, number] {
  let setsA = 0;
  let setsB = 0;

  for (let i = 0; i < gamesA.length; i++) {
    // handle incomplete sets
    if (gamesA[i] < 6 && gamesB[i] < 6) continue;

    if (gamesA[i] > gamesB[i]) {
      setsA += 1;
    } else {
      setsB += 1;
    }
  }

  return [setsA, setsB];
}

/**
 * Converts points into games/sets and updates matches & players
 */

export function aggregateMatch(
  match: CurrentMatch,
  matches: Matches,
  players: Players
): void {
  const GAME_MIN_POINTS = 4;
  const SET_MIN_POINTS = 6;
  const WIN_LEAD = 2;

  let pointsInGameA = 0;
  let pointsInGameB = 0;
  let gamesInSetA = 0;
  let gamesInSetB = 0;
  const gamesWonPerSetA: number[] = [];
  const gamesWonPerSetB: number[] = [];

  for (const point of match.points) {
    if (point === 0) {
      pointsInGameA += 1;
    } else {
      pointsInGameB += 1;
    }

    // check if player won game: 4 points and 2 leads
    const leadA = pointsInGameA - pointsInGameB;
    const leadB = pointsInGameB - pointsInGameA;

    const hasWonGameA = pointsInGameA >= GAME_MIN_POINTS && leadA >= WIN_LEAD;
    const hasWonGameB = pointsInGameB >= GAME_MIN_POINTS && leadB >= WIN_LEAD;

    if (hasWonGameA) {
      gamesInSetA += 1;

      // reset game points
      pointsInGameA = 0;
      pointsInGameB = 0;
    } else if (hasWonGameB) {
      gamesInSetB += 1;

      // reset game points
      pointsInGameA = 0;
      pointsInGameB = 0;
    }

    // Check if player has won 6 games
    if (gamesInSetA >= SET_MIN_POINTS || gamesInSetB >= SET_MIN_POINTS) {
      gamesWonPerSetA.push(gamesInSetA);
      gamesWonPerSetB.push(gamesInSetB);

      // reset count
      gamesInSetA = 0;
      gamesInSetB = 0;
    }
  }

  // handle last set of the match in case it does not reach 6 points
  if (gamesInSetA > 0 || gamesInSetB > 0) {
    gamesWonPerSetA.push(gamesInSetA);
    gamesWonPerSetB.push(gamesInSetB);

    // reset count
    gamesInSetA = 0;
    gamesInSetB = 0;
  }

  const [setsA, setsB] = computeSets(gamesWonPerSetA, gamesWonPerSetB);

  const { id, playerA, playerB } = match;
  const winner = computeWinner({ setsA, setsB, playerA, playerB });

  matches[id] = {
    id,
    playerA,
    playerB,
    winner,
    sets: [setsA, setsB],
  };

  const totalGamesA = gamesWonPerSetA.reduce((a, b) => a + b, 0);
  const totalGamesB = gamesWonPerSetB.reduce((a, b) => a + b, 0);

  players[match.playerA].gamesWon += totalGamesA;
  players[match.playerA].gamesLost += totalGamesB;

  players[match.playerB].gamesWon += totalGamesB;
  players[match.playerB].gamesLost += totalGamesA;
}

/**
 * Parses the tournament file and aggregates match/player stats
 */

export function readTournamentFile(filepath: string): Tournament {
  if (!filepath) {
    throw new Error("File name is missing");
  }

  const lines = fs.readFileSync(filepath, "utf8").trim().split("\n");

  const MATCH_HEADING = "Match:";
  const PLAYERS_HEADING = "vs";

  const matches: Matches = {};
  const players: Players = {};

  let currentMatch: CurrentMatch = null;

  for (const line of lines) {
    // start a new match
    if (line.startsWith(MATCH_HEADING)) {
      const id = line.replace(MATCH_HEADING, "").trim();
      if (currentMatch) {
        aggregateMatch(currentMatch, matches, players);
      }

      // initialise match data
      currentMatch = { id, playerA: "", playerB: "", points: [] };
    }
    // set playerA and playerB
    else if (line.includes(PLAYERS_HEADING)) {
      const [a, b] = line.split(PLAYERS_HEADING).map((x) => x.trim());

      currentMatch.playerA = a;
      currentMatch.playerB = b;

      // initialise players data
      if (!players[a]) {
        players[a] = { gamesWon: 0, gamesLost: 0 };
      }
      if (!players[b]) {
        players[b] = { gamesWon: 0, gamesLost: 0 };
      }
      // parseInt(line).toString() to handle end of line \r
    } else if (line === "0" || line === "1") {
      if (currentMatch) {
        currentMatch.points.push(Number(line));
      }
    }
  }

  // handle last match
  if (currentMatch) {
    aggregateMatch(currentMatch, matches, players);
  }

  return { matches, players };
}