import Game from '../../models/Game.model';
import Term from '../../models/Term.model';
import Action from '../Action.model';

const GAMES_GAME_CREATED_OR_UPDATED = 'GAMES_GAME_CREATED_OR_UPDATED';
export function createGameUpsertedAction(game: Game): Action<{ game: Game }> {
  return {
    type: GAMES_GAME_CREATED_OR_UPDATED,
    payload: { game },
  };
}

const GAMES_UPSERT_TERM_TO_GAME = 'GAMES_UPSERT_TERM_TO_GAME';
export function createUpsertTermAction(
  gameId: string,
  term: Term
): Action<{ gameId: string; term: Term }> {
  return {
    type: GAMES_UPSERT_TERM_TO_GAME,
    payload: {
      gameId,
      term,
    },
  };
}

const GAMES_REMOVE_TERM_FROM_GAME = 'GAMES_REMOVE_TERM_FROM_GAME';
export function createRemoveTermAction(
  gameId: string,
  termId: string
): Action<{ gameId: string; termId: string }> {
  return {
    type: GAMES_REMOVE_TERM_FROM_GAME,
    payload: {
      gameId,
      termId,
    },
  };
}

export interface GamesState {
  [id: string]: Game;
}
export const initialGamesState: GamesState = {};

export function gamesReducer(
  games: GamesState,
  { type, payload }: Action<any>
): GamesState {
  switch (type) {
    case GAMES_GAME_CREATED_OR_UPDATED: {
      const { game } = payload as { game: Game };
      return { ...games, [game.id]: game };
    }
    case GAMES_UPSERT_TERM_TO_GAME: {
      const { gameId, term } = payload as { gameId: string; term: Term };
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          terms: [...games[gameId].terms.filter((t) => t.id !== term.id), term],
        },
      };
    }
    case GAMES_REMOVE_TERM_FROM_GAME: {
      const { gameId, termId } = payload as { gameId: string; termId: string };
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          terms: games[gameId].terms.filter((term) => term.id !== termId),
        },
      };
    }
    default:
      return games;
  }
}
