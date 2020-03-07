const express = require('express');
const gamesController = require('./controllers/games.controller');
const termsController = require('./controllers/games/terms.controller');

const router = express.Router();

router.post('/games', gamesController.post);
router.post('/games/:gameId/terms', termsController.post);

module.exports = router;
