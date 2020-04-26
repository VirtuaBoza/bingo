import React, { ComponentType, useContext, useEffect, useReducer } from 'react';
import { AppState, AsyncStorage } from 'react-native';
import { storeKey } from '../constants/Keys';
import Game from '../models/Game.model';
import User from '../models/User.model';
import mockGameService from '../services/mockGameService';
import rootReducer, { createRootResetAction } from './reducers';
import Action from './reducers/Action.model';
import { GamesState, initialGamesState } from './reducers/gamesReducer';
import { initialUserState, UserState } from './reducers/userReducer';

export interface State {
  user: UserState;
  games: GamesState;
}
export const initialState: State = {
  user: initialUserState,
  games: initialGamesState,
};
const StoreContext = React.createContext(null as any);

export function selectUser(state: State): User {
  return state.user;
}

export function selectGames(state: State): Game[] {
  return Object.values(state.games);
}

export function selectGameById(id: string): (state: State) => Game {
  return (state) => state.games[id];
}

export function connect(
  mapStateToProps?:
    | null
    | ((ownProps?: any) => { [key: string]: (state: State) => any }),
  mapDispatchToProps?: { [key: string]: (...args: any[]) => Action<any> }
) {
  return (Component: ComponentType<any>) => {
    return (ownProps?: any) => {
      const [state, dispatch] = useContext(StoreContext) as [
        State,
        React.Dispatch<any>
      ];
      let storeProps = {} as { [key: string]: any };
      if (mapStateToProps) {
        const mapper = mapStateToProps(ownProps);
        for (let [key, value] of Object.entries(mapper)) {
          storeProps[key] = value(state);
        }
      } else {
        storeProps = state;
      }

      let dispatchProps = {} as { [key: string]: any };
      if (mapDispatchToProps) {
        for (let [key, value] of Object.entries(mapDispatchToProps)) {
          dispatchProps[key] = (...args: any[]) => dispatch(value(...args));
        }
      } else {
        dispatchProps = { dispatch };
      }
      return <Component {...ownProps} {...storeProps} {...dispatchProps} />;
    };
  };
}

export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(storeKey).then((storedState) => {
      if (storedState) {
        try {
          const state = JSON.parse(storedState);

          // TODO: remove
          mockGameService.setGameState(state.games);

          dispatch(
            createRootResetAction({
              ...initialState,
              ...state,
            })
          );
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    function handleAppStateChange(nextAppState: any) {
      if (nextAppState === 'background') {
        AsyncStorage.setItem(storeKey, JSON.stringify(state));
      }
    }
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AsyncStorage.setItem(storeKey, JSON.stringify(state));
      AppState.removeEventListener('change', handleAppStateChange);
    };
  });

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
