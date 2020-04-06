const GAMES_GAME_CREATED_OR_UPDATED = 'GAMES_GAME_CREATED_OR_UPDATED';
export function createGameUpertedAction(game) {
  return {
    type: GAMES_GAME_CREATED_OR_UPDATED,
    payload: game,
  };
}

const GAMES_SET_GAME_TERMS = 'GAMES_SET_GAME_TERMS';
export function createSetGameTermsAction(gameId, terms) {
  return {
    type: GAMES_SET_GAME_TERMS,
    payload: {
      gameId,
      terms,
    },
  };
}

export const initialGamesState = {};

export default function (games, { type, payload }) {
  switch (type) {
    case GAMES_GAME_CREATED_OR_UPDATED:
      return { ...games, [payload._id]: payload };
    case GAMES_SET_GAME_TERMS:
      return {
        ...games,
        [payload.gameId]: {
          ...games[payload.gameId],
          terms: payload.terms,
        },
      };
    default:
      return games;
  }
}
