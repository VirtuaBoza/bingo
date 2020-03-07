const GAMES_GAME_CREATED = 'GAMES_GAME_CREATED';
export function createGameCreatedAction(game) {
  return {
    type: GAMES_GAME_CREATED,
    payload: game,
  };
}

export const initialGamesState = {};

export default function(games, action) {
  switch (action.type) {
    case GAMES_GAME_CREATED:
      return { ...games, [action.payload._id]: action.payload };
    default:
      return games;
  }
}
