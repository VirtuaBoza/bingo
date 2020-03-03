import getEnvVars from '../environment';
const { apiUrl } = getEnvVars();
const url = `${apiUrl}/api/games`;
console.log(url);
export default {
  createGame: (gameName, userName) => {
    fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameName, userName }),
    }).catch(err => console.log(err));
  },
};
