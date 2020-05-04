import { GameStatus } from 'src/enums/GameStatus.enum';

export interface BoardMakingData {
  status: GameStatus;
  terms: [{ id: string }];
  game_players: [{ player: { id: string } }];
}
