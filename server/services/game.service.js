const GameModel = require('../db/models/game');

module.exports = {
  get: async (gameId) => {
    const gameDoc = await GameModel.findById(gameId).exec();
    return gameDoc.toObject();
  },
  create: async ({ name, gameMaster }) => {
    let gameDoc = new GameModel({ name, gameMaster });
    gameDoc = await gameDoc.save();
    return gameDoc.toObject();
  },
  upsertTerm: async (gameId, term) => {
    let gameDoc = await GameModel.findOneAndUpdate(
      { _id: gameId, 'terms.id': { $ne: term.id } },
      { $push: { terms: term } },
      { new: true }
    ).exec();
    if (gameDoc) {
      return gameDoc.toObject().terms;
    }
    gameDoc = await GameModel.findOneAndUpdate(
      { _id: gameId, 'terms.id': term.id },
      { $set: { 'terms.$.text': term.text } },
      { new: true }
    ).exec();
    if (gameDoc) {
      return gameDoc.toObject().terms;
    }
    return null;
  },
  addPlayer: async (gameId, player) => {
    const gameDoc = await GameModel.findOneAndUpdate(
      { _id: gameId, 'players.token': { $ne: player.token } },
      { $addToSet: { players: player } },
      { new: true }
    ).exec();
    if (gameDoc) {
      return gameDoc.toObject();
    }
    return null;
  },
};
