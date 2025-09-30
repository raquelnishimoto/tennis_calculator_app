import * as fs from "fs";
import * as path from "path";

type Sets = Record<string, number>;
type Games = Record<string, number>;

type MatchData = {
  players: [string, string];
  games: { [player: string]: number }; // total of games won
  sets: { [player: string]: number }; // total of sets won
  winner: string | null;
};

type Tournament = Record<string, MatchData>;

/**
 * Loads tournament full score from a file
 * @param {string} filename - name of the file in test/test_data folder
 * @returns {string}
 */
function readAndParseTournamentFile(filename: string): Tournament {
  const NEW_MATCH = "Match:";
  const NEW_MATCH_SEPARATOR = ":";
  const PLAYERS = " vs ";
  const ZERO = "0";
  const ONE = "1";
  const tournament: Tournament = {};

  const filepath = path.join(__dirname, "..", "test", "test_data", filename);
  const lines = fs.readFileSync(filepath, "utf8").trim().split("\n");

  let currentMatchId = "";
  const gamePoints = { 0: 0, 1: 0 };

  for (const line of lines) {
    // skip blank lines
    if (!line.trim()) continue;

    // Match: id starts a new match
    if (line.startsWith(NEW_MATCH)) {
      currentMatchId = line.split(NEW_MATCH_SEPARATOR)[1].trim();
      tournament[currentMatchId] = {
        players: ["", ""],
        games: {},
        sets: {},
        winner: null,
      };

      // 'Person X vs Person Y' extract players name
    } else if (line.includes(PLAYERS)) {
      const [playerA, playerB] = line.split(PLAYERS);
      const A = playerA.trim();
      const B = playerB.trim();
      tournament[currentMatchId].players = [A, B];

      // set the initial values for games and sets
      tournament[currentMatchId].games = { [A]: 0, [B]: 0 };
      tournament[currentMatchId].sets = { [A]: 0, [B]: 0 };

      // 0 or 1 push points in array for the match
    } else if (line === ZERO || line === ONE) {
      gamePoints[line] += 1;

      // Check if player has 4 points and 2 ahead?
      const gameWinnerIdx = getGameWinnerIdx(gamePoints);
      if (gameWinnerIdx >= 0) {
        const gameWinnerName =
          tournament[currentMatchId].players[gameWinnerIdx];
        // increment games counter
        tournament[currentMatchId].games[gameWinnerName] += 1;

        // reset game points
        gamePoints[0] = 0;
        gamePoints[1] = 0;
      }

      const players = tournament[currentMatchId].players;
      // Check if player has 6 games?
      const setWinnerName = getSetWinnerName(tournament[currentMatchId].games);
      if (setWinnerName) {
        //increment sets counter
        tournament[currentMatchId].sets[setWinnerName] += 1;

        tournament[currentMatchId].games = {
          [players[0]]: 0,
          [players[1]]: 0,
        };
      }

      // Check if player has 2 sets?
      const sets = tournament[currentMatchId].sets;
      const matchWinner = getMatchWinnerName(sets, players);
      if (matchWinner) {
        tournament[currentMatchId].winner = matchWinner;
      }
    }
  }

  return tournament;
}

function getGameWinnerIdx(points: Record<"0" | "1", number>) {
  let winner = -1;
  const WINNER_MIN_POINTS = 4;
  const WINNER_POINTS_DIFFERENCE = 2;

  const playerAPoints = points[0];
  const playerBPoints = points[1];
  if (
    playerAPoints >= WINNER_MIN_POINTS &&
    playerAPoints - playerBPoints >= WINNER_POINTS_DIFFERENCE
  ) {
    winner = 0;
  }
  if (
    playerBPoints >= WINNER_MIN_POINTS &&
    playerBPoints - playerAPoints >= WINNER_POINTS_DIFFERENCE
  ) {
    winner = 1;
  }

  return winner;
}

function getSetWinnerName(games: Games): string | null {
  const WINNER_MIN_POINTS = 6;

  for (const player in games) {
    if (games[player] >= WINNER_MIN_POINTS) {
      return player;
    }
  }

  return null;
}

function getMatchWinnerName(points: Sets, players: [string, string]) {
  let winner = null;
  const WINNER_MIN_POINTS = 2;

  const [playerA, playerB] = players;
  const playerAPoints = points[playerA];
  const playerBPoints = points[playerB];
  if (playerAPoints >= WINNER_MIN_POINTS) {
    winner = playerA;
  }
  if (playerBPoints >= WINNER_MIN_POINTS) {
    winner = playerB;
  }

  return winner;
}

console.log(readAndParseTournamentFile("full_tournament.txt"));
