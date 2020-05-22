import { GameStatus } from '@abizzle/mafingo-core';

export interface BoardMakingData {
  status: GameStatus;
  terms: [{ id: string }];
  game_players: [{ player: { id: string } }];
}
