import { readTournamentFile } from "./readAndParseFile";

/*
 * Data driven tests, same test handling different input
 */
const testCases = [
  {
    testName: "Player A wins 2 sets and is the winner",
    inputFile: "simple_match_playerA_wins.txt",
    expectedResult: {
      matches: {
        "01": {
          id: "01",
          playerA: "Person A",
          playerB: "Person B",
          winner: "Person A",
          sets: [2, 0],
        },
      },
      players: {
        "Person A": { gamesWon: 13, gamesLost: 7 },
        "Person B": { gamesWon: 7, gamesLost: 13 },
      },
    },
  },
  {
    testName: "Player B wins in a close 3-set match",
    inputFile: "match_playerB_wins_2_1.txt",
    expectedResult: {
      matches: {
        "02": {
          id: "02",
          playerA: "Person A",
          playerB: "Person B",
          winner: "Person B",
          sets: [1, 2],
        },
      },
      players: {
        "Person A": { gamesWon: 13, gamesLost: 19 },
        "Person B": { gamesWon: 19, gamesLost: 13 },
      },
    },
  },
  {
    testName: "Multiple matches in the same tournament file",
    inputFile: "two_matches.txt",
    expectedResult: {
      matches: {
        "01": {
          id: "01",
          playerA: "Person A",
          playerB: "Person B",
          winner: null,
          sets: [1, 0],
        },
        "02": {
          id: "02",
          playerA: "Person C",
          playerB: "Person D",
          winner: "Person C",
          sets: [3, 0],
        },
      },
      players: {
        "Person A": { gamesWon: 6, gamesLost: 0 },
        "Person B": { gamesWon: 0, gamesLost: 6 },
        "Person C": { gamesWon: 18, gamesLost: 15 },
        "Person D": { gamesWon: 15, gamesLost: 18 },
      },
    },
  },
  {
    testName: "Unfinished match still records games but not sets",
    inputFile: "unfinished_match.txt",
    expectedResult: {
      matches: {
        "03": {
          id: "03",
          playerA: "Person A",
          playerB: "Person B",
          winner: null,
          sets: [0, 0], // no completed sets yet
        },
      },
      players: {
        "Person A": { gamesWon: 4, gamesLost: 2 },
        "Person B": { gamesWon: 2, gamesLost: 4 },
      },
    },
  },
  {
    testName: "Edge case: set ends 6–5 (allowed by rules)",
    inputFile: "edgecase_set_6_5.txt",
    expectedResult: {
      matches: {
        "04": {
          id: "04",
          playerA: "Person A",
          playerB: "Person B",
          winner: null,
          sets: [1, 0],
        },
      },
      players: {
        "Person A": { gamesWon: 6, gamesLost: 5 },
        "Person B": { gamesWon: 5, gamesLost: 6 },
      },
    },
  },
];

testCases.forEach(({ testName, inputFile, expectedResult }) => {
  test(testName, () => {
    expect(readTournamentFile(`test/test_data/${inputFile}`)).toEqual(expectedResult);
  });
});
