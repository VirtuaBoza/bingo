const GameModel = require('../../db/models/game');

module.exports = {
  post: async (req, res) => {
    const { gameName: name, userName: gameMaster } = req.body;
    let game = new GameModel({ name, gameMaster });
    game = await game.save();
    res.json(game);
  },
};
