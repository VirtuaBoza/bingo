import { StackActions } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Machine } from 'xstate';
import gameService from '../services/gameService';

const FORM_STATES = {
  invalid: 'invalid',
  valid: 'valid',
  submitting: 'submitting',
  failure: 'failure',
};

const EVENT = {
  validate: 'validate',
  invalidate: 'invalidate',
  submit: 'submit',
  fail: 'fail',
};

const formMachine = Machine({
  id: 'newGameForm',
  initial: FORM_STATES.invalid,
  states: {
    [FORM_STATES.invalid]: {
      on: {
        [EVENT.validate]: FORM_STATES.valid,
      },
    },
    [FORM_STATES.valid]: {
      on: {
        [EVENT.submit]: FORM_STATES.submitting,
        [EVENT.invalidate]: FORM_STATES.invalid,
      },
    },
    [FORM_STATES.submitting]: {
      on: {
        [EVENT.fail]: FORM_STATES.failure,
      },
    },
    [FORM_STATES.failure]: {},
  },
});

export default function NewGameScreen({ navigation }) {
  const [gameName, setGameName] = useState('');
  const [userName, setUserName] = useState('');
  const [state, send] = useMachine(formMachine);

  useEffect(() => {
    if (gameName.length && userName.length) {
      send(EVENT.validate);
    } else {
      send(EVENT.invalidate);
    }
  });

  function handleSubmit() {
    send(EVENT.submit);
    gameService
      .createGame(gameName, userName)
      .then(game => {
        navigation.dispatch(StackActions.replace('Lobby', { game }));
      })
      .catch(() => {
        send(EVENT.fail);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Game Name: </Text>
      <TextInput
        onChangeText={setGameName}
        style={styles.input}
        editable={!state.matches(FORM_STATES.submitting)}
        autoFocus
      />
      <Text style={styles.label}>Your Name: </Text>
      <TextInput
        onChangeText={setUserName}
        style={styles.input}
        editable={!state.matches(FORM_STATES.submitting)}
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
        disabled={
          state.matches(FORM_STATES.invalid) ||
          state.matches(FORM_STATES.submitting)
        }
      />
      <ActivityIndicator
        animating={state.matches(FORM_STATES.submitting)}
        size="large"
      />
      {state.matches(FORM_STATES.failure) && <Text>Something went wrong.</Text>}
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
    padding: 20,
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
