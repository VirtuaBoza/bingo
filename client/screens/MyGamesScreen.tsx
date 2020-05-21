import { Game, GameStatus as Status } from 'mafingo-core';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PageContainer, Stack, Text, Title, ToggleButton } from '../components';
import BoardThumbnail from '../components/BoardThumbnail';
import Colors from '../constants/Colors';
import Routes from '../constants/Routes';
import { usePromise } from '../hooks';
import { User } from '../models';
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

  const activeGames = games.filter((g) => g.status !== Status.Finished);
  const completedGames = games.filter((g) => g.status === Status.Finished);

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
        {state === states.completed && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <View style={styles.statContainer}>
              <Text font="display">Wins</Text>
              <Text font="display" color={Colors.primary}>
                0
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text font="display">Losses</Text>
              <Text font="display" color={Colors.primary}>
                1
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text font="display">W/L</Text>
              <Text font="display" color={Colors.primary}>
                2
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text font="display">Streak</Text>
              <Text font="display" color={Colors.primary}>
                3
              </Text>
            </View>
          </View>
        )}
      </Stack>
      <View style={styles.listContainer}>
        <FlatList
          data={state === states.active ? activeGames : completedGames}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item: game }) => (
            <TouchableOpacity
              onPress={() => handleGamePress(game)}
              style={styles.listItem}
            >
              <View style={{ height: 50, width: 50, alignItems: 'center' }}>
                {game.variant ? (
                  <BoardThumbnail
                    variant={game.variant}
                    size={50}
                    color={Colors.secondary}
                  />
                ) : (
                  <Mafingo />
                )}
              </View>
              <View
                style={{
                  paddingLeft: 25,
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>{game.name}</Text>
                {game.status === Status.Finished && (
                  <Text font="display" color={Colors.primary}>
                    {game.game_players.find((gp) => gp.player.id === user.id)
                      ?.winner
                      ? 'Win!'
                      : 'Loss'}
                  </Text>
                )}
              </View>
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
    paddingHorizontal: 25,
    backgroundColor: Colors.lightPink,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContainer: {
    alignItems: 'center',
  },
});
