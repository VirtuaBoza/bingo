import User from '../../models/User.model';
import Action from './Action.model';

const USER_SET_USERNAME = 'USER_SET_USERNAME';
export function createSetUsernameAction(username: string): Action<string> {
  return {
    type: USER_SET_USERNAME,
    payload: username,
  };
}

export interface UserState extends User {}
export const initialUserState: UserState = {
  username: '',
};

export default function (user: UserState, { type, payload }: Action<any>) {
  switch (type) {
    case USER_SET_USERNAME:
      return { ...user, username: payload };
    default:
      return user;
  }
}
