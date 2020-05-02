import { Game, Term } from '../../models';
import Action from '../Action.model';

const GAMES_GAME_CREATED_OR_UPDATED = 'GAMES_GAME_CREATED_OR_UPDATED';
interface GameUpsertedPayload {
  game: Game;
}
export type GameUpsertedActionCreator = (
  game: Game
) => Action<GameUpsertedPayload>;
export const createGameUpsertedAction: GameUpsertedActionCreator = (game) => {
  return {
    type: GAMES_GAME_CREATED_OR_UPDATED,
    payload: { game },
  };
};

const GAMES_UPSERT_TERM_TO_GAME = 'GAMES_UPSERT_TERM_TO_GAME';
interface UpsertTermPayload {
  gameId: string;
  term: Term;
}
export type UpserTermActionCreator = (
  gameId: string,
  term: Term
) => Action<UpsertTermPayload>;
export const createUpsertTermAction: UpserTermActionCreator = (
  gameId,
  term
) => {
  return {
    type: GAMES_UPSERT_TERM_TO_GAME,
    payload: {
      gameId,
      term,
    },
  };
};

const GAMES_REMOVE_TERM_FROM_GAME = 'GAMES_REMOVE_TERM_FROM_GAME';
interface RemoveTermPayload {
  gameId: string;
  termId: string;
}
export type RemoveTermActionCreator = (
  gameId: string,
  termId: string
) => Action<RemoveTermPayload>;
export const createRemoveTermAction: RemoveTermActionCreator = (
  gameId,
  termId
) => {
  return {
    type: GAMES_REMOVE_TERM_FROM_GAME,
    payload: {
      gameId,
      termId,
    },
  };
};

const GAMES_TOGGLE_PLAYER_READY = 'GAMES_TOGGLE_PLAYER_READY';
interface TogglePlayerReadyPayload {
  gameId: string;
  userId: string;
}
export type TogglePlayerActionCreator = (
  gameId: string,
  userId: string
) => Action<TogglePlayerReadyPayload>;
export const createTogglePlayerReadyAction: TogglePlayerActionCreator = (
  gameId,
  userId
) => {
  return {
    type: GAMES_TOGGLE_PLAYER_READY,
    payload: {
      gameId,
      userId,
    },
  };
};

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
      const { game } = payload as GameUpsertedPayload;
      return { ...games, [game.id]: game };
    }
    case GAMES_UPSERT_TERM_TO_GAME: {
      const { gameId, term } = payload as UpsertTermPayload;
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          terms: games[gameId].terms.find((t) => t.id === term.id)
            ? games[gameId].terms.map((t) =>
                t.id === term.id ? { ...term } : t
              )
            : [...games[gameId].terms, term],
        },
      };
    }
    case GAMES_REMOVE_TERM_FROM_GAME: {
      const { gameId, termId } = payload as RemoveTermPayload;
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          terms: games[gameId].terms.filter((term) => term.id !== termId),
        },
      };
    }
    case GAMES_TOGGLE_PLAYER_READY: {
      const { gameId, userId } = payload as TogglePlayerReadyPayload;
      return {
        ...games,
        [gameId]: {
          ...games[gameId],
          game_players: games[gameId].game_players.map((gp) =>
            gp.player.id === userId ? { ...gp, ready: !gp.ready } : { ...gp }
          ),
        },
      };
    }
    default:
      return games;
  }
}
