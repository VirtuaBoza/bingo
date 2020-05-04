import React from 'react';
import { Text, View } from 'react-native';
import { Status } from '../enums/Status.enum';
import { Game } from '../models';
import { connect, selectGameById } from '../store';
import {
  GameBoardScreen,
  GameBuildingScreen,
  GameLobbyScreen,
} from './GameScreens';

export const GameScreen: React.FC<{
  game: Game;
}> = ({ game, ...rest }) => {
  if (game) {
    switch (game.status) {
      case Status.Unstarted:
        return <GameLobbyScreen {...rest} />;
      case Status.Building:
        return <GameBuildingScreen {...rest} />;
      case Status.Started:
        return <GameBoardScreen {...rest} />;
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

export default connect(({ route }) => {
  const { gameId } = route.params;
  const gameSelector = selectGameById(gameId);
  return { game: gameSelector };
})(GameScreen);
