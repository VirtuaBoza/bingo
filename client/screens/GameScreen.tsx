import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Status } from '../enums/Status.enum';
import { Game } from '../models';
import { gameService } from '../services';
import { connect, selectGameById } from '../store';
import {
  createGameUpsertedAction,
  GameUpsertedActionCreator,
} from '../store/reducers';
import {
  GameBoardScreen,
  GameBuildingScreen,
  GameLobbyScreen,
} from './GameScreens';

export const GameScreen: React.FC<{
  game: Game;
  updateGameInStore: GameUpsertedActionCreator;
}> = ({ game: gameFromStore, updateGameInStore, ...rest }) => {
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    const subscription = gameService
      .subscribeToGame(gameFromStore.id)
      .subscribe(
        (gameFromServer) => {
          if (!updating && gameFromServer) {
            updateGameInStore(gameFromServer);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    return () => {
      subscription.unsubscribe();
    };
  });

  if (gameFromStore) {
    switch (gameFromStore.status) {
      case Status.Unstarted:
        return <GameLobbyScreen {...rest} setUpdating={setUpdating} />;
      case Status.Building:
        return <GameBuildingScreen {...rest} setUpdating={setUpdating} />;
      case Status.Started:
        return <GameBoardScreen {...rest} setUpdating={setUpdating} />;
      case Status.Finished:
        return (
          <View>
            <Text>Finished</Text>
          </View>
        );
      default:
        break;
    }
  }
  return (
    <View>
      <Text>Default</Text>
    </View>
  );
};

export default connect(
  ({ route }) => {
    const { gameId } = route.params;
    const gameSelector = selectGameById(gameId);
    return { game: gameSelector };
  },
  { updateGameInStore: createGameUpsertedAction }
)(GameScreen);
