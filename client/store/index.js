import React, { useContext, useEffect, useReducer } from 'react';
import { AppState, AsyncStorage } from 'react-native';
import { storeKey } from '../constants/Keys';
import rootReducer, { createRootResetAction } from './reducers';
import { initialGamesState } from './reducers/gamesReducer';
import { initialUserState } from './reducers/userReducer';

const StoreContext = React.createContext();

export const useStore = selector => {
  const [state, dispatch] = useContext(StoreContext);
  if (selector) {
    return [selector(state), dispatch];
  }
  return [state, dispatch];
};

const initialState = {
  user: initialUserState,
  games: initialGamesState,
};

export function userSelector(state) {
  return state.user;
}

export function gamesSelector(state) {
  return Object.values(state.games);
}

export function connect(mapStateToProps, mapDispatchToProps) {
  return Component => {
    return props => {
      const [state, dispatch] = useContext(StoreContext);
      let storeProps = {};
      if (mapStateToProps) {
        for (let [key, value] of Object.entries(mapStateToProps)) {
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
      return <Component {...props} {...storeProps} {...dispatchProps} />;
    };
  };
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(storeKey).then(storedState => {
      if (storedState) {
        try {
          dispatch(
            createRootResetAction({
              ...initialState,
              ...JSON.parse(storedState),
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
