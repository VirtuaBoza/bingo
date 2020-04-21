import uuid from '../utils/uuid';

const db = {};

class Game {
  constructor(gameName, username) {
    this.name = gameName;
    this.gameMaster = { username };
    this._id = uuid();
    this.terms = [];
    this.players = [];
  }
}

export default {
  createGame: async (gameName, username) => {
    return new Promise((resolve) => {
      const game = new Game(gameName, username);
      db[game._id] = game;
      resolve(game);
    });
  },
  getGame: (gameId) => {
    return new Promise((resolve) => {
      resolve(db[gameId]);
    });
  },
  upsertTerm: (gameId, term) => {
    return new Promise((resolve) => {
      const game = db[gameId];
      if (term._id) {
        game.terms = game.terms.map((t) => (t._id === term._id ? term : t));
      } else {
        term._id = uuid();
        game.terms = [...game.terms, term];
      }
      resolve(term);
    });
  },
  deleteTerm: (gameId, termKey) => {
    return new Promise((resolve) => {
      db[gameId].terms = db[gameId].terms.filter((t) => t.key !== termKey);
      resolve();
    });
  },
  joinGame: async (gameId, username) => {
    return new Promise((resolve) => {
      db[gameId].players = [...db[gameId].players, { username }];
      resolve();
    });
  },
};
