import { GameStatus } from 'mafingo-core/src/enums/GameStatus.enum';

export interface BoardMakingData {
  status: GameStatus;
  terms: [{ id: string }];
  game_players: [{ player: { id: string } }];
}
