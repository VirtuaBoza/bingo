import User from '../../models/User.model';
import Action from '../Action.model';

const USER_SET_USERNAME = 'USER_SET_USERNAME';
export function createSetUserAction(user: User): Action<User> {
  return {
    type: USER_SET_USERNAME,
    payload: user,
  };
}

export interface UserState extends User {}
export const initialUserState: UserState = {
  id: '',
  username: '',
};

export function userReducer(user: UserState, { type, payload }: Action<any>) {
  switch (type) {
    case USER_SET_USERNAME:
      return { ...payload };
    default:
      return user;
  }
}
