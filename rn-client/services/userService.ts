import { Notifications } from 'expo';
import * as Device from 'expo-device';
import * as Permissions from 'expo-permissions';
import gql from 'graphql-tag';
import client from '../apolloClient';
import { User } from '../models';

async function getToken(): Promise<string | null> {
  let token = null;
  if (Device.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      token = await Notifications.getExpoPushTokenAsync();
    }
  }
  return token;
}

export default {
  addUser: async (username: string): Promise<User> => {
    const token = await getToken();

    return client
      .mutate({
        variables: { username, token },
        mutation: gql`
          mutation AddPlayer($username: String!, $token: String) {
            insert_players(
              objects: { username: $username, expo_token: $token }
            ) {
              returning {
                id
                username
              }
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.insert_players.returning[0];
      });
  },
};
