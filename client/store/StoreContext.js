import React, { useContext, useEffect, useReducer } from 'react';
import { AppState, AsyncStorage } from 'react-native';
import { storeKey } from '../constants/Keys';
import rootReducer, { createRootResetAction } from './reducers';
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
};

export function userSelector(state) {
  return state.user;
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
      AppState.removeEventListener('change', handleAppStateChange);
    };
  });

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
