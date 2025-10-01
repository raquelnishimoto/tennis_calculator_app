import { handleQueries } from "./handleQueries";
import { Matches, Players } from "./types";

/*
 * Test data
 */
const matches: Matches = {
  "01": {
    id: "01",
    playerA: "Person A",
    playerB: "Person B",
    winner: "Person A",
    sets: [2, 0],
  },
  "02": {
    id: "02",
    playerA: "Person A",
    playerB: "Person B",
    winner: "Person B",
    sets: [1, 2],
  },
  "03": {
    id: "03",
    playerA: "Person A",
    playerB: "Person B",
    winner: undefined,
    sets: [1, 1],
  },
};

const players: Players = {
  "Person A": {
    gamesWon: 12,
    gamesLost: 5,
  },
  "Person B": {
    gamesWon: 9,
    gamesLost: 8,
  },
};

/*
 * Test cases
 */

const testCases = [
  {
    name: "Score Match queries: returns match result when match exists and has a winner",
    query: "Score Match 01",
    expectedOutput: "Person A defeated Person B\n2 sets to 0\n",
  },
  {
    name: "Score Match queries: returns message when match does not exist",
    query: "Score Match 99",
    expectedOutput: "Match 99 not found\n",
  },
  {
    name: "Score Match queries: returns message when match exists but has no winner",
    query: "Score Match 03",
    expectedOutput: "Match didn't have a winner\n",
  },
  {
    name: "Games Player queries: returns games won/lost for a known player",
    query: "Games Player Person A",
    expectedOutput: "\n12 5",
  },
  {
    name: "Games Player queries: returns message when player does not exist",
    query: "Games Player Unknown",
    expectedOutput: "\nPlayer Unknown not found",
  },
  {
    name: "Multiple queries in one input: handles mix of match and player queries",
    query: `
Score Match 01
Games Player Person B
Score Match 02
`,
    expectedOutput:
      "Person A defeated Person B\n2 sets to 0\n\n9 8Person B defeated Person A\n2 sets to 1\n",
  },
  {
    name: "Edge cases: returns empty string if input is empty",
    query: "",
    expectedOutput: "",
  },
];

testCases.forEach(({ name, query, expectedOutput }) => {
  test(name, () => {
    const result = handleQueries(query, matches, players);
    expect(result).toBe(expectedOutput);
  });
});
