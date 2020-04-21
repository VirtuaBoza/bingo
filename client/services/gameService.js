import { Notifications } from 'expo';
import * as Device from 'expo-device';
import getEnvVars from '../environment';
import httpClient from '../utils/httpClient';
const { apiUrl } = getEnvVars();
const gamesRoute = `${apiUrl}/api/games`;

export default {
  createGame: async (gameName, username) => {
    let token;
    if (Device.isDevice) {
      token = await Notifications.getExpoPushTokenAsync();
    }
    return httpClient.post(gamesRoute, { gameName, username, token });
  },
  getGame: (gameId) => {
    return httpClient.get(`${gamesRoute}/${encodeURIComponent(gameId)}`);
  },
  upsertTerm: (gameId, term) => {
    return httpClient.post(`${gamesRoute}/${gameId}/terms`, { term });
  },
  deleteTerm: (gameId, termKey) => {
    console.log('called delete service on client');
    return httpClient.delete(
      `${gamesRoute}/${gameId}/terms/${encodeURIComponent(termKey)}`
    );
  },
  joinGame: async (gameId, username) => {
    let token;
    if (Device.isDevice) {
      token = await Notifications.getExpoPushTokenAsync();
    }
    return httpClient.post(`${gamesRoute}/${gameId}/players`, {
      username,
      token,
    });
  },
};
