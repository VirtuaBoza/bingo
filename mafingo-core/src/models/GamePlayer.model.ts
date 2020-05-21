import { Board } from './Board.model';
import { Player } from './Player.model';

export interface GamePlayer {
  player: Player;
  ready: boolean;
  board?: Board;
  winner: boolean;
}
