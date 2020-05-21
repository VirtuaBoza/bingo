import { BoardVariant } from '../enums';
import { GameStatus as Status } from '../enums/GameStatus.enum';
import { GamePlayer } from './GamePlayer.model';
import { Term } from './Term.model';

export interface Game {
  id: string;
  name: string;
  status: Status;
  variant?: BoardVariant;
  terms: Term[];
  game_players: GamePlayer[];
  game_master_id: string;
}
