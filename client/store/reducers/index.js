import userReducer from './userReducer';

export const ROOT_RESET = 'ROOT_RESET';
export function createRootResetAction(state) {
  return {
    type: ROOT_RESET,
    payload: state,
  };
}

export default function rootReducer(state, action) {
  switch (action.type) {
    case ROOT_RESET:
      return action.payload;
    default:
      return combineReducers({
        user: userReducer,
      })(state, action);
  }
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
