const USER_SET_USERNAME = 'USER_SET_USERNAME';
export function createSetUsernameAction(username) {
  return {
    type: USER_SET_USERNAME,
    payload: username,
  };
}

export const initialUserState = {
  username: '',
};

export default function(user, action) {
  switch (action.type) {
    case USER_SET_USERNAME:
      return { ...user, username: action.payload };
    default:
      return user;
  }
}
