import React, { useContext, useEffect, useReducer } from 'react';
import { AppState, AsyncStorage } from 'react-native';
import { storeKey } from '../constants/Keys';
import mockGameService from '../services/mockGameService';
import rootReducer, { createRootResetAction } from './reducers';
import { initialGamesState } from './reducers/gamesReducer';
import { initialUserState } from './reducers/userReducer';

const StoreContext = React.createContext();

export const initialState = {
  user: initialUserState,
  games: initialGamesState,
};

export function selectUser(state) {
  return state.user;
}

export function selectGames(state) {
  return Object.values(state.games);
}

export function selectGameById(id) {
  return (state) => state.games[id];
}

export function connect(mapStateToProps, mapDispatchToProps) {
  return (Component) => {
    return (ownProps) => {
      const [state, dispatch] = useContext(StoreContext);
      let storeProps = {};
      if (mapStateToProps) {
        const mapper = mapStateToProps(ownProps);
        for (let [key, value] of Object.entries(mapper)) {
          storeProps[key] = value(state);
        }
      } else {
        storeProps = state;
      }

      let dispatchProps = {};
      if (mapDispatchToProps) {
        for (let [key, value] of Object.entries(mapDispatchToProps)) {
          dispatchProps[key] = (...args) => dispatch(value(...args));
        }
      } else {
        dispatchProps = { dispatch };
      }
      return <Component {...ownProps} {...storeProps} {...dispatchProps} />;
    };
  };
}

export const StoreProvider = ({ children }) => {
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
    function handleAppStateChange(nextAppState) {
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
