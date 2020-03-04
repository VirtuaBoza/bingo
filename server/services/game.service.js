const GameModel = require('../db/models/game');

module.exports = {
  create: ({ name, gameMaster }) => {
    const game = new GameModel({ name, gameMaster });
    return game.save();
  },
};
