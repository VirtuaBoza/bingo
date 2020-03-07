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

export default function(user, { type, payload }) {
  switch (type) {
    case USER_SET_USERNAME:
      return { ...user, username: payload };
    default:
      return user;
  }
}
