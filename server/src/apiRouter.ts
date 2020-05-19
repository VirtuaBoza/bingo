import express from 'express';
import { GameStatus } from './enums/GameStatus.enum';
import didIWin from './services/didIWin';
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

router.post('/markTerm', async function (req, res) {
  let { termId, userId } = req.query as {
    termId?: string;
    userId?: string;
  };

  const game = await gameService.markTerm(termId, userId);

  if (!game) {
    res.status(400).send('Bad Request');
  } else {
    const winningTerms = game.terms.reduce((acc, cur) => {
      if (cur.marked_by) {
        acc[cur.id] = true;
      }
      return acc;
    }, {} as { [id: string]: boolean });

    let weHaveAWinner = false;

    game.game_players.forEach(async (gp) => {
      const won = didIWin(gp.board, winningTerms);
      if (won) {
        weHaveAWinner = true;
        await gameService.markAsWinner(gp.player_id);
      }
    });

    if (weHaveAWinner) {
      await gameService.setGameStatus(game.id, GameStatus.Finished);
    }

    res.status(204).send();
  }
});

export default router;
