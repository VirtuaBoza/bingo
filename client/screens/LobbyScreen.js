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
import {
  createGameCreatedAction,
  createSetGameTermsAction,
} from '../store/reducers/gamesReducer';

export default connect(
  ({ route }) => {
    const { gameId } = route.params;
    const gameSelector = selectGameById(gameId);
    return { game: gameSelector };
  },
  {
    setGameTerms: createSetGameTermsAction,
    updateGame: createGameCreatedAction,
  }
)(LobbyScreen);

export function LobbyScreen({ navigation, game, setGameTerms, updateGame }) {
  const [newTerm, setNewTerm] = useState('');
  const [localTerms, setLocalTerms] = useState(game.terms);
  const ref = useRef();

  useEffect(() => {
    gameService.getGame(game._id).then(game => {
      updateGame(game);
      console.log('am i about to reset?');
      setLocalTerms(game.terms);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: `${game.name}` });
    let timeout;
    timeout = setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 1);

    function handleKeyboardHide() {
      setLocalTerms(localTerms.filter(t => t.trim()));
    }
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
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
    gameService.addTermToGame(game._id, newTerm.trim()).then(terms => {
      setGameTerms(game._id, terms);
      setLocalTerms([...terms, '']);
      setNewTerm('');
    });
  }

  return (
    <View style={styles.container}>
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
      <Button title="Add Term" onPress={handleAddTermClick} />
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
});
