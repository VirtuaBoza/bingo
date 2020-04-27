// import Game from '../models/Game.model';
// import GamePlayer from '../models/GamePlayer.model';
// import Term from '../models/Term.model';
// import { GamesState } from '../store/reducers/gamesReducer';
// import uuid from '../utils/uuid';

// let db = {} as GamesState;

// class GameClass implements Game {
//   id: string;
//   terms: Term[] = [];
//   game_players: GamePlayer[] = [];

//   constructor(
//     public name: string,
//     public game_master_id: string,
//     username: string
//   ) {
//     this.id = uuid();
//     this.game_players.push({
//       player: { id: game_master_id, username },
//       ready: true,
//     });
//   }
// }

// export default {
//   setGameState: (gameState: GamesState) => {
//     db = gameState;
//   },
//   createGame: async (gameName: string, username: string): Promise<Game> => {
//     return new Promise((resolve) => {
//       const game = new GameClass(gameName, username, username);
//       db[game.id] = game;
//       resolve(game);
//     });
//   },
//   getGame: (gameId: string): Promise<Game> => {
//     return new Promise((resolve) => {
//       console.log(db[gameId]);
//       resolve(db[gameId]);
//     });
//   },
//   upsertTerm: (gameId: string, term: Term): Promise<Term> => {
//     return new Promise((resolve) => {
//       const game = db[gameId];
//       if (term.id) {
//         game.terms = game.terms.map((t) => (t.id === term.id ? term : t));
//       } else {
//         term.id = uuid();
//         game.terms = [...game.terms, term];
//       }
//       resolve(term);
//     });
//   },
//   deleteTerm: (gameId: string, termId: string): Promise<undefined> => {
//     return new Promise((resolve) => {
//       db[gameId].terms = db[gameId].terms.filter((t) => t.id !== termId);
//       resolve();
//     });
//   },
//   // joinGame: async (gameId: string, username: string): Promise<Game> => {
//   //   return new Promise((resolve) => {
//   //     db[gameId].players = [...db[gameId].players, { username }];
//   //     resolve();
//   //   });
//   // },
// };
