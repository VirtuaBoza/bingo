import GamePlayer from './GamePlayer.model';
import Term from './Term.model';

export default interface Game {
  id: string;
  name: string;
  terms: Term[];
  game_players: GamePlayer[];
  game_master_id: string;
}
