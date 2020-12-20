import User from '../../models/User.model';
import Action from '../Action.model';

interface SetUserPayload {
  user: User;
}
export type SetUserActionCreator = (user: User) => Action<SetUserPayload>;
const USER_SET_USER = 'USER_SET_USER';
export function createSetUserAction(user: User): Action<SetUserPayload> {
  return {
    type: USER_SET_USER,
    payload: { user },
  };
}

export interface UserState extends User {}
export const initialUserState: UserState = {
  id: '',
  username: '',
};

export function userReducer(user: UserState, { type, payload }: Action<any>) {
  switch (type) {
    case USER_SET_USER: {
      const { user } = payload as SetUserPayload;
      return { ...user };
    }
    default:
      return user;
  }
}
