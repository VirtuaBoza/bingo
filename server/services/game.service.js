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
  addTerm: async (gameId, term) => {
    let gameDoc = await GameModel.findOneAndUpdate(
      { _id: gameId, 'terms.key': { $ne: term.key } },
      { $push: { terms: term } },
      { new: true }
    ).exec();
    if (gameDoc) {
      return gameDoc.toObject().terms.find((t) => t.key === term.key);
    }
    return null;
  },
  updateTerm: async (gameId, term) => {
    let gameDoc = await GameModel.findOneAndUpdate(
      { _id: gameId, 'terms.key': term.key },
      { $set: { 'terms.$.text': term.text } },
      { new: true }
    ).exec();
    if (gameDoc) {
      return gameDoc.toObject().terms.find((t) => t.key === term.key);
    }
    return null;
  },
  deleteTerm: async (gameId, termKey) => {
    console.log('delete, you bitch', gameId, termKey);
    const gameDoc = await GameModel.findById(gameId).exec();
    const game = gameDoc.toObject();
    const terms = game.terms.filter((t) => t.key !== termKey);
    gameDoc.terms = terms;
    await gameDoc.save();
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
