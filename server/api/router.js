const express = require('express');
const gamesController = require('./controllers/games.controller');

const router = express.Router();

router.post('/games', gamesController.post);

module.exports = router;
