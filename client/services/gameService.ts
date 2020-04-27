import gql from 'graphql-tag';
import client from '../apolloClient';
import { Game, Term } from '../models';

const GAME = `
{
  id
  name
  terms {
    id
    text
  }
  game_players {
    player {
      id
      username
    }
    ready
  }
  game_master_id
}
`;

export default {
  createGame: async (name: string, userId: string): Promise<Game> => {
    return client
      .mutate({
        variables: { userId, name },
        mutation: gql`
        mutation AddGame($userId: uuid!, $name: String!) {
          insert_games(
            objects: {
              game_master_id: $userId
              name: $name
              game_players: { data: { player_id: $userId, ready: true } }
            }
          ) {
            returning ${GAME}
          }
        }
  `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.insert_games.returning[0];
      });
  },
  getGame: (id: string): Promise<Game> => {
    return client
      .query({
        fetchPolicy: 'no-cache',
        variables: { id },
        query: gql`
          query GetGame($id: String!) {
            games_by_pk(id: $id) {
              id
              name
              terms {
                id
                text
              }
              game_players {
                player {
                  id
                  username
                }
                ready
              }
              game_master_id
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.games_by_pk;
      });
  },
  upsertTerm: (gameId: string, term: Term): Promise<number> => {
    return client
      .mutate({
        variables: { id: term.id, text: term.text, gameId },
        mutation: gql`
          mutation UpsertTerm($id: uuid!, $text: String!, $gameId: String!) {
            insert_terms(
              objects: { game_id: $gameId, id: $id, text: $text }
              on_conflict: {
                constraint: terms_pkey
                update_columns: text
                where: { game_id: { _eq: $gameId }, id: { _eq: $id } }
              }
            ) {
              affected_rows
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.insert_terms.affected_rows;
      });
  },
  deleteTerm: (gameId: string, id: string): Promise<number> => {
    return client
      .mutate({
        variables: { id, gameId },
        mutation: gql`
          mutation DeleteTerm($id: uuid!, $gameId: String!) {
            delete_terms(
              where: { game_id: { _eq: $gameId }, id: { _eq: $id } }
            ) {
              affected_rows
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.delete_terms.affected_rows;
      });
  },
  // joinGame: async (gameId, username) => {
  //   let token;
  //   if (Device.isDevice) {
  //     token = await Notifications.getExpoPushTokenAsync();
  //   }
  //   return httpClient.post(`${gamesRoute}/${gameId}/players`, {
  //     username,
  //     token,
  //   });
  // },
};
