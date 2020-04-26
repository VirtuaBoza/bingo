import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Routes from '../constants/Routes';
import { Game } from '../models';
import { connect, selectGames } from '../store';

export const GamesScreen: React.FC<any> = ({ games, navigation }) => {
  function handleGamePress(game: Game) {
    navigation.navigate(Routes.Lobby, { gameId: game.id });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item: game }) => (
          <TouchableOpacity onPress={() => handleGamePress(game)}>
            <Text>
              {game.name} ({game._id})
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(game) => game._id}
      />
    </View>
  );
};

export default connect(() => ({ games: selectGames }))(GamesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
});
