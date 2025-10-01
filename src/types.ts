type MatchData = {
  id: string;
  winner: string;
  playerA: string;
  playerB: string;
  sets: [number, number]; // total sets won
};

type PlayerData = {
  gamesWon: number;
  gamesLost: number;
};

type Name = string;
type Id = string;

export type Matches = Record<Id, MatchData>;
export type Players = Record<Name, PlayerData>;

