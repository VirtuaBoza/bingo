import express from 'express';
import gameService from './gameService';

const router = express.Router();

router.post('/createGameBoards/:gameId', async function (req, res) {
  const game = await gameService.getBoardMakingData(req.params.gameId);
  res.json(game);
});

export default router;
