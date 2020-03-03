const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,
  gameMaster: String,
});

module.exports = mongoose.model('Game', gameSchema);
