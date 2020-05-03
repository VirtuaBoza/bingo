import gql from 'graphql-tag';
import client from './apolloClient';

const gameService = {
  getBoardMakingData: (gameId: string): Promise<any> => {
    return client
      .query({
        fetchPolicy: 'no-cache',
        variables: { gameId },
        query: gql`
          query GetBoardMakingData($gameId: String!) {
            games_by_pk(id: $gameId) {
              terms {
                id
              }
              game_players {
                player {
                  id
                }
              }
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.games_by_pk;
      });
  },
};

export default gameService;
