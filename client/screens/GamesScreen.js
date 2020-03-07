import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Routes from '../constants/Routes';
import { connect, selectGames } from '../store';

export default connect(() => ({ games: selectGames }))(GamesScreen);

export function GamesScreen({ games, navigation }) {
  console.log(games);
  function handleGamePress(game) {
    navigation.navigate(Routes.Lobby, { gameId: game._id });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item: game }) => (
          <TouchableOpacity onPress={() => handleGamePress(game)}>
            <Text>{game.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={game => game._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
});
