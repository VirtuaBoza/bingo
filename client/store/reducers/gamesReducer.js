const GAMES_GAME_CREATED_OR_UPDATED = 'GAMES_GAME_CREATED_OR_UPDATED';
export function createGameUpsertedAction(game) {
  return {
    type: GAMES_GAME_CREATED_OR_UPDATED,
    payload: {
      game,
    },
  };
}

const GAMES_UPSERT_TERM_TO_GAME = 'GAMES_UPSERT_TERM_TO_GAME';
export function createUpsertTermAction(gameId, term) {
  return {
    type: GAMES_UPSERT_TERM_TO_GAME,
    payload: {
      gameId,
      term,
    },
  };
}

const GAMES_REMOVE_TERM_FROM_GAME = 'GAMES_REMOVE_TERM_FROM_GAME';
export function createRemoveTermAction(gameId, termKey) {
  return {
    type: GAMES_REMOVE_TERM_FROM_GAME,
    payload: {
      gameId,
      termKey,
    },
  };
}

export const initialGamesState = {};

export default function (games, { type, payload }) {
  switch (type) {
    case GAMES_GAME_CREATED_OR_UPDATED: {
      const { game } = payload;
      return { ...games, [game._id]: game };
    }
    case GAMES_UPSERT_TERM_TO_GAME: {
      const { gameId, term } = payload;
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          terms: [
            ...games[gameId].terms.filter((t) => t.key !== term.key),
            term,
          ],
        },
      };
    }
    case GAMES_REMOVE_TERM_FROM_GAME: {
      const { gameId, termKey } = payload;
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          terms: games[gameId].terms.filter((term) => term.key !== termKey),
        },
      };
    }
    default:
      return games;
  }
}
