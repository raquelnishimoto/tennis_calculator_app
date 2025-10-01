import {Matches, Players} from './types';
/**
 * Handles query output
 */

function scoreMatch(matches: Matches, id: string): string {
  const match = matches[id];
  if (!match) return `Match ${id} not found`;

  const { winner, playerA, playerB, sets } = match;

  if (!winner) return `Match didn't have a winner`; 

  const defeated = winner === playerA ? playerB : playerA;
  const maxPoints = Math.max(...sets);
  const minPoints = Math.min(...sets);

  return `${match.winner} defeated ${defeated}\n${maxPoints} sets to ${minPoints}`;
}

function gamesForPlayer(players: Players, name: string): string {
  const player = players[name];

  if (!player) return `Player ${name} not found`;

  return `${player.gamesWon} ${player.gamesLost}`;
}

export function handleQueries(
  input: string,
  matches: Matches,
  players: Players
): string {
  const MATCH_QUERY = "Score Match";
  const PLAYER_QUERY = "Games Player";

  const query = input.trim().split("\n");

  if (!query) return;

  return query.reduce((acc, line) => {
    /* Argument for match and player will be located at 2 index
     ** e.g. Score Match <id> or Games Player <name>
     */
    const arg = line.split(" ").slice(2).join(" ").trim();

    if (line.startsWith(MATCH_QUERY)) {
      acc += scoreMatch(matches, arg) + `\n`;
    }
    if (line.startsWith(PLAYER_QUERY)) {
      acc += `\n` + gamesForPlayer(players, arg);
    }

    return acc;
  }, '');
}
