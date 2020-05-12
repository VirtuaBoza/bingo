import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PageContainer } from '../components';
import Routes from '../constants/Routes';
import { usePromise } from '../hooks';
import { Game, User } from '../models';
import { gameService } from '../services';
import { connect, selectGames, selectUser } from '../store';
import {
  createRefreshGamesAction,
  RefreshGamesActionCreator,
} from '../store/reducers';

export const MyGamesScreen: React.FC<{
  games: Game[];
  navigation: any;
  user: User;
  refreshGames: RefreshGamesActionCreator;
}> = ({ games, navigation, user, refreshGames }) => {
  usePromise(
    [],
    () =>
      user.id
        ? gameService.getMyGames(user.id)
        : new Promise<Game[]>((res) => res([])),
    refreshGames
  );

  function handleGamePress(game: Game) {
    navigation.navigate(Routes.Lobby, { gameId: game.id });
  }

  return (
    <PageContainer>
      <FlatList
        data={games}
        renderItem={({ item: game }) => (
          <TouchableOpacity onPress={() => handleGamePress(game)}>
            <Text>
              {game.name} ({game.id})
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(game) => game.id}
      />
    </PageContainer>
  );
};

export default connect(() => ({ games: selectGames, user: selectUser }), {
  refreshGames: createRefreshGamesAction,
})(MyGamesScreen);

const styles = StyleSheet.create({});
