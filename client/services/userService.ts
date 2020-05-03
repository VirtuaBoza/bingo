import { Notifications } from 'expo';
import * as Device from 'expo-device';
import gql from 'graphql-tag';
import client from '../apolloClient';
import { User } from '../models';

export default {
  addUser: async (username: string): Promise<User> => {
    let token = null;
    if (Device.isDevice) {
      token = await Notifications.getExpoPushTokenAsync();
    }

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
