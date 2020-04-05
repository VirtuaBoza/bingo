const gameService = require('../../services/game.service');

module.exports = {
  post: async (req, res) => {
    const { gameName: name, username, token } = req.body;
    const game = await gameService.create({
      name,
      gameMaster: { username, token },
    });
    res.json(game);
  },
  get: async (req, res) => {
    const { gameId } = req.params;
    const game = await gameService.get(gameId);
    res.json(game);
  },
};
