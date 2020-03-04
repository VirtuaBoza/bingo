import getEnvVars from '../environment';
import httpClient from '../utils/httpClient';
const { apiUrl } = getEnvVars();
const url = `${apiUrl}/api/games`;

export default {
  createGame: (gameName, userName) => {
    return httpClient.post(url, { gameName, userName });
  },
};
