import Game from '../../models/Game.model';
import Action from '../Action.model';

const GAMES_GAME_CREATED_OR_UPDATED = 'GAMES_GAME_CREATED_OR_UPDATED';
export function createGameUpsertedAction(game: Game): Action<{ game: Game }> {
  return {
    type: GAMES_GAME_CREATED_OR_UPDATED,
    payload: { game },
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
    default:
      return games;
  }
}
