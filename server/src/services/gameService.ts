import { BoardVariant, Game, GameStatus } from '@abizzle/mafingo-core';
import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';
import client from '../apolloClient';
import { BoardMakingData, TermMarkingGame } from '../models';

const GAME = gql`
  {
    id
    name
    status
    variant
    terms(order_by: { created_at: asc }) {
      id
      text
      updated_at
      marked_by
    }
    game_players(order_by: { created_at: asc }) {
      player {
        id
        username
      }
      ready
      board
      winner
    }
    game_master_id
  }
`;

const gameService = {
  getBoardMakingData(gameId: string): Promise<BoardMakingData> {
    return client
      .query({
        fetchPolicy: 'no-cache',
        variables: { gameId },
        query: gql`
          query GetBoardMakingData($gameId: String!) {
            games_by_pk(id: $gameId) {
              status
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
  setGameVariant(gameId: string, variant: BoardVariant): Promise<boolean> {
    return client
      .mutate({
        variables: { gameId, variant },
        mutation: gql`
          mutation SetVariant($gameId: String!, $variant: game_variant_enum!) {
            update_games(
              where: { id: { _eq: $gameId } }
              _set: { variant: $variant }
            ) {
              affected_rows
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return Boolean(res.data.update_games.affected_rows);
      });
  },
  setGameStatus(gameId: string, status: GameStatus): Promise<boolean> {
    return client
      .mutate({
        variables: { gameId, status },
        mutation: gql`
          mutation SetStatus($gameId: String!, $status: game_status_enum!) {
            update_games(
              where: { id: { _eq: $gameId } }
              _set: { status: $status }
            ) {
              affected_rows
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return Boolean(res.data.update_games.affected_rows);
      });
  },
  updateGamePlayerBoard(
    gameId: string,
    playerId: string,
    board: string[][]
  ): Promise<boolean> {
    return client
      .mutate({
        variables: { gameId, playerId, board },
        mutation: gql`
          mutation UpdateGamePlayerBoard(
            $gameId: String!
            $playerId: uuid!
            $board: jsonb
          ) {
            update_game_players(
              _set: { board: $board }
              where: {
                game_id: { _eq: $gameId }
                player_id: { _eq: $playerId }
              }
            ) {
              affected_rows
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return Boolean(res.data.update_game_players.affected_rows);
      });
  },
  markTerm(termId: string, userId: string): Promise<TermMarkingGame> {
    return client
      .mutate({
        fetchPolicy: 'no-cache',
        variables: { termId, userId },
        mutation: gql`
          mutation MarkTerm($termId: uuid!, $userId: uuid!) {
            update_terms(
              where: { id: { _eq: $termId } }
              _set: { marked_by: $userId }
            ) {
              returning {
                game {
                  id
                  terms {
                    id
                    marked_by
                  }
                  game_players {
                    player_id
                    board
                  }
                }
              }
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return res.data.update_terms.returning[0]?.game;
      });
  },
  markAsWinner(playerId: string): Promise<boolean> {
    return client
      .mutate({
        fetchPolicy: 'no-cache',
        variables: { playerId },
        mutation: gql`
          mutation MarkAsWinner($playerId: uuid!) {
            update_game_players(
              where: { player_id: { _eq: $playerId } }
              _set: { winner: true }
            ) {
              affected_rows
            }
          }
        `,
      })
      .then((res) => {
        if (res.errors) throw res.errors;
        return Boolean(res.data.update_game_players.affected_rows);
      });
  },
  createGame(name: string, userId: string): Promise<Game> {
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
  getGame(id: string): Promise<Game> {
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
  insertTerm(gameId: string, text: string) {
    return client
      .mutate({
        variables: { id: uuid(), text: text, gameId },
        mutation: gql`
          mutation InsertTerm($id: uuid!, $text: String!, $gameId: String!) {
            insert_terms(objects: { game_id: $gameId, id: $id, text: $text }) {
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
};

export default gameService;
