const gameService = require('../../services/game.service');

module.exports = {
  post: async (req, res) => {
    const { gameName: name, userName: gameMaster } = req.body;
    const game = await gameService.create({ name, gameMaster });
    res.json(game);
  },
};
