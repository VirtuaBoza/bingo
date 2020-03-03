import * as React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import gameService from '../services/gameService';

export default function NewGameScreen() {
  const [gameName, setGameName] = React.useState('');
  const [userName, setUserName] = React.useState([]);

  function handleSubmit() {
    gameService.createGame(gameName, userName);
  }

  return (
    <View style={styles.container}>
      <Text>Game Name: </Text>
      <TextInput onChangeText={setGameName} />
      <Text>Your Name: </Text>
      <TextInput onChangeText={setUserName} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

NewGameScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  debug1: {
    backgroundColor: 'red',
  },
  debug2: {
    backgroundColor: 'blue',
  },
});
