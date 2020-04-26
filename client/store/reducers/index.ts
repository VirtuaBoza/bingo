import gamesReducer from './gamesReducer';
import userReducer from './userReducer';

export const ROOT_RESET = 'ROOT_RESET';
export function createRootResetAction(state) {
  return {
    type: ROOT_RESET,
    payload: state,
  };
}

export default function rootReducer(state, action) {
  if (false && __DEV__) {
    console.log('oldState', state);
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
      })(state, action);
      break;
  }
  if (false && __DEV__) {
    console.log('newState', newState);
    console.log('complete');
  }
  return newState;
}

function combineReducers({ ...reducers }) {
  return (state, action) => {
    const newState = { ...state };
    for (let [key, value] of Object.entries(reducers)) {
      newState[key] = value(state[key], action);
    }
    return newState;
  };
}
