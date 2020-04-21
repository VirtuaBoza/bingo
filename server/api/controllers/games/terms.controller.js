const gameService = require('../../../services/game.service');

module.exports = {
  post: async (req, res) => {
    const { gameId } = req.params;
    let { term } = req.body;
    if (term._id) {
      term = await gameService.updateTerm(gameId, term);
    } else {
      term = await gameService.addTerm(gameId, term);
    }
    if (term) {
      res.json(term);
    } else {
      res.status(400);
    }
  },
  delete: async (req, res) => {
    console.log('called delete endpoint');
    const { gameId, termKey } = req.params;
    await gameService.deleteTerm(gameId, termKey);
    res.status(204);
  },
};
