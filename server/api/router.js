const express = require('express');
const gamesController = require('./controllers/games.controller');
const termsController = require('./controllers/games/terms.controller');
const playersController = require('./controllers/games/players.controller');

const router = express.Router();

router.post('/games', gamesController.post);
router.get('/games/:gameId', gamesController.get);

router.post('/games/:gameId/terms', termsController.post);
router.delete('/games/:gameId/terms/:termKey', termsController.delete);

router.post('/games/:gameId/players', playersController.post);

module.exports = router;
