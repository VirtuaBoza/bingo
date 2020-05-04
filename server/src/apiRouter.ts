import express from 'express';
import { GameStatus } from './enums/GameStatus.enum';
import { createGameBoard, getRequiredTermsLength } from './services/gameMaker';
import gameService from './services/gameService';

const router = express.Router();

router.post('/startGame', async function (req, res) {
  let { gameId, size, freeSpace } = req.query as any;
  size = Number(size);
  freeSpace = /^(1|true)$/i.test(freeSpace);

  if (!gameId) {
    res.status(400).send('Bad Request');
  } else if (isNaN(size) || size < 3 || size > 5) {
    res.status(400).send('Bad Request');
  } else {
    const game = await gameService.getBoardMakingData(gameId);

    if (
      !game ||
      game.status !== GameStatus.Unstarted ||
      game.terms.length < getRequiredTermsLength(size, freeSpace)
    ) {
      res.status(400).send('Bad Request');
    }

    await gameService.setGameStatus(gameId, GameStatus.Building);

    for (const gamePlayer of game.game_players) {
      const board = createGameBoard(
        game.terms.map((t) => t.id),
        size,
        freeSpace
      );
      await gameService.updateGamePlayerBoard(
        gameId,
        gamePlayer.player.id,
        board
      );
    }

    await gameService.setGameStatus(gameId, GameStatus.Started);

    res.status(204).send();
  }
});

export default router;
