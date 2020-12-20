import { Game } from '@abizzle/mafingo-core';
import React, { ComponentType, useContext, useEffect, useReducer } from 'react';
import { AppState, AsyncStorage } from 'react-native';
import { storeKey } from '../constants/Keys';
import User from '../models/User.model';
import Action from './Action.model';
import {
  gamesReducer,
  GamesState,
  initialGamesState,
  initialUserState,
  userReducer,
  UserState,
} from './reducers';

export interface Store {
  user: UserState;
  games: GamesState;
}
export const initialState: Store = {
  user: initialUserState,
  games: initialGamesState,
};
export const StoreContext = React.createContext(null as any);

export function selectUser(store: Store): User {
  return store.user;
}

export function selectGames(store: Store): Game[] {
  return Object.values(store.games);
}

export function selectGameById(id: string): (store: Store) => Game {
  return (store) => store.games[id];
}

export function connect(
  mapStateToProps?:
    | null
    | ((ownProps?: any) => { [key: string]: (store: Store) => any }),
  mapDispatchToProps?: { [key: string]: (...args: any[]) => Action<any> }
) {
  return (Component: ComponentType<any>) => {
    return (ownProps?: any) => {
      const [store, dispatch] = useContext<[Store, any]>(StoreContext);
      let storeProps = {} as { [key: string]: any };
      if (mapStateToProps) {
        const mapper = mapStateToProps(ownProps);
        for (let [key, selector] of Object.entries(mapper)) {
          storeProps[key] = selector(store);
        }
      } else {
        storeProps = store;
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

const ROOT_RESET = 'ROOT_RESET';
export function createRootResetAction(store: Store) {
  return {
    type: ROOT_RESET,
    payload: store,
  };
}

export function rootReducer(store: Store, action: Action<any>) {
  if (false && __DEV__) {
    console.log('oldState', store);
    console.log('action', action);
  }
  let newState;
  switch (action.type) {
    case ROOT_RESET:
      newState = action.payload;
      break;
    default:
      newState = combineReducers({
        user: userReducer,
        games: gamesReducer,
      })(store, action);
      break;
  }
  if (false && __DEV__) {
    console.log('newState', newState);
    console.log('complete');
  }
  return newState;
}

function combineReducers({ ...reducers }) {
  return (store: Store, action: Action<any>) => {
    const newState = { ...store };
    for (let [key, reducer] of Object.entries(reducers)) {
      newState[key as keyof Store] = reducer(store[key as keyof Store], action);
    }
    return newState;
  };
}
