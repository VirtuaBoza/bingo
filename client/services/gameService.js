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
  addTermToGame: (gameId, term) => {
    return httpClient.post(`${gamesRoute}/${gameId}/terms`, { term });
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
