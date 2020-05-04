import { Status } from '../enums/Status.enum';
import GamePlayer from './GamePlayer.model';
import Term from './Term.model';

export default interface Game {
  id: string;
  name: string;
  status: Status;
  terms: Term[];
  game_players: GamePlayer[];
  game_master_id: string;
}
