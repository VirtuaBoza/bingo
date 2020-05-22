import { Board } from '@abizzle/mafingo-core';

export interface TermMarkingGame {
  id: string;
  terms: Array<{ id: string; marked_by?: string }>;
  game_players: Array<{ player_id: string; board: Board }>;
}
