import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Routes from '../constants/Routes';
import { connect, gamesSelector } from '../store';

function GamesScreen({ games, navigation }) {
  function handleGamePress(game) {
    navigation.navigate(Routes.Lobby, { game });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item: game }) => (
          <TouchableOpacity onPress={() => handleGamePress(item)}>
            <Text>{game.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item._id}
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

export default connect({ games: gamesSelector })(GamesScreen);
