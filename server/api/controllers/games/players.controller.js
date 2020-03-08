const gameService = require('../../../services/game.service');

module.exports = {
  post: async (req, res) => {
    const { gameId } = req.params;
    const { username, token } = req.body;
    const game = await gameService.addPlayer(gameId, { username, token });
    if (game) {
      res.json(game);
    }
    res.status(400);
  },
};
