const GameModel = require('../db/models/game');

module.exports = {
  create: async ({ name, gameMaster }) => {
    let gameDoc = new GameModel({ name, gameMaster });
    gameDoc = await gameDoc.save();
    return gameDoc.toObject();
  },
  addTerm: async (gameId, term) => {
    const gameDoc = await GameModel.findByIdAndUpdate(
      gameId,
      { $addToSet: { terms: term } },
      { new: true }
    ).exec();
    if (gameDoc) {
      return gameDoc.toObject().terms;
    }
    return null;
  },
};
