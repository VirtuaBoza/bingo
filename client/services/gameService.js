import getEnvVars from '../environment';
import httpClient from '../utils/httpClient';
const { apiUrl } = getEnvVars();
const gamesRoute = `${apiUrl}/api/games`;

export default {
  createGame: (gameName, userName) => {
    return httpClient.post(gamesRoute, { gameName, userName });
  },
  addTermToGame: (gameId, term) => {
    return httpClient.post(`${gamesRoute}/${gameId}/terms`, { term });
  },
};
