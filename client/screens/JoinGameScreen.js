import { StackActions } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
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
})(JoinGameScreen);

export function JoinGameScreen({ user, addGame, setUsername, navigation }) {
  const [code, setCode] = useState('');
  const [userName, setUserName] = useState(user.username || '');
  const [currentState, transition] = useFormStateMachine();
  const ref = useRef();

  useEffect(() => {
    if (code.length && userName.length) {
      transition(FORM_EVENT.validate);
    } else {
      transition(FORM_EVENT.invalidate);
    }
  });

  async function handleFormSubmit() {
    if (
      currentState.matches(FORM_STATE.valid) ||
      currentState.matches(FORM_STATE.failure)
    ) {
      setUsername(userName);
      transition(FORM_EVENT.submit);
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        alert('You will not be able to play without notifications.');
      } else {
        try {
          const game = await gameService.joinGame(code, userName);
          addGame(game);
          navigation.dispatch(
            StackActions.replace(Routes.Lobby, { gameId: game._id })
          );
        } catch (err) {
          if (__DEV__) {
            console.log(err);
          }
          transition(FORM_EVENT.fail);
        }
      }
    }
  }

  function handleSubmit() {
    ref.current.focus();
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Enter a Game Code:</Text>
        <TextInput
          placeholder="Game Code"
          value={code}
          onChangeText={setCode}
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
          enablesReturnKeyAutomatically
        />
        <ActivityIndicator
          animating={currentState.matches(FORM_STATE.submitting)}
          size="large"
        />
        {currentState.matches(FORM_STATE.failure) && <Text>No bueno.</Text>}
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
