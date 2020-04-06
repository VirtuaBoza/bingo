const mongoose = require('mongoose');
const shortid = require('shortid');

const gameSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  name: String,
  gameMaster: { username: String, token: String },
  terms: [{ id: String, text: String }],
  players: [{ username: String, token: String, ready: Boolean }],
});

module.exports = mongoose.model('Game', gameSchema);
