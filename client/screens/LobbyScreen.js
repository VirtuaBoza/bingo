import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import gameService from '../services/gameService';
import { connect, selectGameById } from '../store';
import { createSetGameTermsAction } from '../store/reducers/gamesReducer';

function LobbyScreen({ navigation, game, setGameTerms }) {
  const [newTerm, setNewTerm] = useState('');
  const [localTerms, setLocalTerms] = useState(game.terms);
  const ref = useRef();

  useEffect(() => {
    navigation.setOptions({ title: `${game.name}` });
    let timeout;
    if (ref.current) {
      timeout = setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      });
    }

    function handleKeyboardHide() {
      setLocalTerms(localTerms.filter(t => t));
    }
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    };
  });

  function handleAddTermClick() {
    setLocalTerms([...localTerms, '']);
  }

  function handleSubmitTerm() {
    gameService.addTermToGame(game._id, newTerm).then(terms => {
      setGameTerms(game._id, terms);
      setLocalTerms([...terms, '']);
      setNewTerm('');
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={localTerms}
          renderItem={({ item }) => (
            <View>
              {item ? (
                <Text>{item}</Text>
              ) : (
                <TextInput
                  value={newTerm}
                  onSubmitEditing={handleSubmitTerm}
                  onChangeText={setNewTerm}
                  ref={ref}
                  blurOnSubmit={false}
                />
              )}
            </View>
          )}
          keyExtractor={item => item}
        />
      </View>
      <Button title="Add Term" onPress={handleAddTermClick} />
    </View>
  );
}

export default connect(
  ({ route }) => {
    const { gameId } = route.params;
    gameSelector = selectGameById(gameId);
    return { game: gameSelector };
  },
  { setGameTerms: createSetGameTermsAction }
)(LobbyScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    padding: 8,
  },
  debug1: {
    backgroundColor: 'red',
  },
  debug2: {
    backgroundColor: 'blue',
  },
});
