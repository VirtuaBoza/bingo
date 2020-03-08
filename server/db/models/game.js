const mongoose = require('mongoose');
const shortid = require('shortid');

const gameSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  name: String,
  gameMaster: String,
  terms: [String],
  players: [{ username: String, token: String }],
});

module.exports = mongoose.model('Game', gameSchema);
