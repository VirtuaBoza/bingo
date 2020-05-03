import { Observable } from 'apollo-link';
import gql from 'graphql-tag';
import client from '../apolloClient';
import { Game, Term } from '../models';

const GAME = `
{
  id
  name
  terms(order_by: {created_at: asc}) {
    id
    text
  }
  game_players(order_by: {created_at: asc}) {
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
            games_by_pk(id: $id) ${GAME}
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.games_by_pk;
      });
  },
  subscribeToGame: (id: string): Observable<Game> => {
    return client
      .subscribe({
        variables: { id },
        query: gql`
          query GetGame($id: String!) {
            games_by_pk(id: $id) ${GAME}
          }
        `,
      })
      .map((res) => {
        if (res.errors) throw res.errors;
        return res.data.games_by_pk as Game;
      });
  },
  upsertTerm: (gameId: string, term: Term): Promise<boolean> => {
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
        return Boolean(res.data.insert_terms.affected_rows);
      });
  },
  deleteTerm: (gameId: string, id: string): Promise<boolean> => {
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
        return Boolean(res.data.delete_terms.affected_rows);
      });
  },
  upsertGamePlayer: async (
    gameId: string,
    userId: string,
    ready: boolean = false
  ): Promise<Game> => {
    return client
      .mutate({
        variables: { gameId, userId, ready },
        mutation: gql`
          mutation UpsertGamePlayer($gameId: String!, $userId: uuid!, $ready: Boolean!) {
            insert_game_players(
              objects: { game_id: $gameId, player_id: $userId, ready: $ready },
              on_conflict: {constraint: game_players_pkey, update_columns: ready}
            ) {
              affected_rows
              returning {
                game ${GAME}
              }
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.insert_game_players.returning[0].game;
      });
  },
};
