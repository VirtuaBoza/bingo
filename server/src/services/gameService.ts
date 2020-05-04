import gql from 'graphql-tag';
import { BoardMakingData } from 'src/models';
import client from '../apolloClient';
import { GameStatus } from '../enums/GameStatus.enum';

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
};

export default gameService;
