import { Type } from "./app_enums";

export interface Leaderboard {
  sessions: Session[];
}

export interface Session {
  type: Type;
  best_of: number;
  matches: Match[];
}

export interface Match {
  games: Game[];
}

export interface Game {
  winner: string;
  loser: string;
}
