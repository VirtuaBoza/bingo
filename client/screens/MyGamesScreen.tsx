import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PageContainer, Stack, Text, Title, ToggleButton } from '../components';
import BoardThumbnail from '../components/BoardThumbnail';
import Colors from '../constants/Colors';
import Routes from '../constants/Routes';
import { BoardVariant, Status } from '../enums';
import { usePromise } from '../hooks';
import { Game, User } from '../models';
import { gameService } from '../services';
import { connect, selectGames, selectUser } from '../store';
import {
  createRefreshGamesAction,
  RefreshGamesActionCreator,
} from '../store/reducers';
import Mafingo from '../svg/Mafingo';

const states = {
  active: 'Active',
  completed: 'Completed',
};

export const MyGamesScreen: React.FC<{
  games: Game[];
  navigation: any;
  user: User;
  refreshGames: RefreshGamesActionCreator;
}> = ({ games, navigation, user, refreshGames }) => {
  const [state, setState] = useState(states.active);
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
      <Stack>
        <Title text="My Games" />
        <ToggleButton
          leftOption={{ label: 'Active', value: states.active }}
          rightOption={{ label: 'Completed', value: states.completed }}
          value={state}
          onPress={setState}
        />
      </Stack>
      <View style={styles.listContainer}>
        <FlatList
          data={games.filter((g) =>
            state === states.active
              ? g.status !== Status.Finished
              : g.status === Status.Finished
          )}
          renderItem={({ item: game }) => (
            <TouchableOpacity
              onPress={() => handleGamePress(game)}
              style={styles.listItem}
            >
              <View style={{ height: 50, width: 75, alignItems: 'center' }}>
                {[Status.Unstarted, Status.Building].includes(game.status) ? (
                  <Mafingo />
                ) : (
                  <BoardThumbnail
                    variant={BoardVariant.Andean}
                    size={50}
                    color={Colors.secondary}
                  />
                )}
              </View>
              <Text>{game.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(game) => game.id}
        />
      </View>
    </PageContainer>
  );
};

export default connect(() => ({ games: selectGames, user: selectUser }), {
  refreshGames: createRefreshGamesAction,
})(MyGamesScreen);

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    height: 75,
    backgroundColor: Colors.lightPink,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
