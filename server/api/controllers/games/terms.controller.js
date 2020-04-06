const gameService = require('../../../services/game.service');

module.exports = {
  post: async (req, res) => {
    const { gameId } = req.params;
    const { term } = req.body;
    const terms = await gameService.upsertTerm(gameId, term);
    if (terms) {
      res.json(terms);
    }
    res.status(400);
  },
};
