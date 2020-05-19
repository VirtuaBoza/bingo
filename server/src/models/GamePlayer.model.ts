import Board from './Board.model';
import Player from './Player.model';

export default interface GamePlayer {
  player: Player;
  ready: boolean;
  board?: Board;
  winner: boolean;
}
