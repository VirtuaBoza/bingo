import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Routes from '../constants/Routes';
import {
  FORM_EVENT,
  FORM_STATE,
  useFormStateMachine,
} from '../hooks/useMachine';
import gameService from '../services/gameService';
import { connect, selectUser } from '../store';
import { createGameCreatedAction } from '../store/reducers/gamesReducer';
import { createSetUsernameAction } from '../store/reducers/userReducer';

export default connect(() => ({ user: selectUser }), {
  setUsername: createSetUsernameAction,
  addGame: createGameCreatedAction,
})(NewGameScreen);

export function NewGameScreen({ user, navigation, setUsername, addGame }) {
  const [gameName, setGameName] = useState('');
  const [userName, setUserName] = useState(user.username || '');
  const ref = useRef();
  const [currentState, transition] = useFormStateMachine();

  useEffect(() => {
    if (gameName.length && userName.length) {
      transition(FORM_EVENT.validate);
    } else {
      transition(FORM_EVENT.invalidate);
    }
  });

  function handleSubmit() {
    ref.current.focus();
  }

  function handleFormSubmit() {
    if (
      currentState.matches(FORM_STATE.valid) ||
      currentState.matches(FORM_STATE.failure)
    ) {
      setUsername(userName);
      transition(FORM_EVENT.submit);
      gameService
        .createGame(gameName, userName)
        .then(game => {
          addGame(game);
          navigation.dispatch(
            StackActions.replace(Routes.Lobby, { gameId: game._id })
          );
        })
        .catch(err => {
          if (__DEV__) {
            console.dir(err);
          }
          transition(FORM_EVENT.fail);
        });
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Game Name:</Text>
        <TextInput
          placeholder="Game Name"
          value={gameName}
          onChangeText={setGameName}
          style={styles.input}
          editable={!currentState.matches(FORM_STATE.submitting)}
          returnKeyType="next"
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
          selectTextOnFocus
          enablesReturnKeyAutomatically
          autoFocus
        />
        <Text style={styles.label}>Your Name:</Text>
        <TextInput
          placeholder="Your Name"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
          editable={!currentState.matches(FORM_STATE.submitting)}
          returnKeyType="go"
          onSubmitEditing={handleFormSubmit}
          ref={ref}
          selectTextOnFocus
        />
        <ActivityIndicator
          animating={currentState.matches(FORM_STATE.submitting)}
          size="large"
        />
        {currentState.matches(FORM_STATE.failure) && (
          <Text>Something went wrong.</Text>
        )}
      </View>
      <Button
        title="Submit"
        onPress={handleFormSubmit}
        disabled={
          currentState.matches(FORM_STATE.invalid) ||
          currentState.matches(FORM_STATE.submitting)
        }
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
