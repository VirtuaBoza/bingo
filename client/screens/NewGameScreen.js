import { StackActions, useNavigation } from '@react-navigation/native';
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
import useAuth from '../hooks/useAuth';
import useMachine from '../hooks/useMachine';
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

const formChart = {
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
};

export default function NewGameScreen() {
  const navigation = useNavigation();
  const [gameName, setGameName] = useState('');
  const [userName, setUserName] = useState('');
  const [state, send] = useMachine(formChart);
  const { getUsername, setUsername } = useAuth();
  const ref = useRef();

  useEffect(() => {
    getUsername().then(storedUsername => {
      if (storedUsername) {
        setUserName(storedUsername);
      }
    });
  }, []);

  useEffect(() => {
    if (gameName.length && userName.length) {
      send(EVENT.validate);
    } else {
      send(EVENT.invalidate);
    }
  });

  function handleSubmit() {
    ref.current.focus();
  }

  function handleFormSubmit() {
    if (state.matches(FORM_STATES.valid)) {
      setUsername(userName);
      send(EVENT.submit);
      gameService
        .createGame(gameName, userName)
        .then(game => {
          navigation.dispatch(StackActions.replace(Routes.Lobby, { game }));
        })
        .catch(() => {
          send(EVENT.fail);
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
          editable={!state.matches(FORM_STATES.submitting)}
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
          editable={!state.matches(FORM_STATES.submitting)}
          returnKeyType="go"
          onSubmitEditing={handleFormSubmit}
          ref={ref}
          selectTextOnFocus
        />
        <ActivityIndicator
          animating={state.matches(FORM_STATES.submitting)}
          size="large"
        />
        {state.matches(FORM_STATES.failure) && (
          <Text>Something went wrong.</Text>
        )}
      </View>
      <Button
        title="Submit"
        onPress={handleFormSubmit}
        disabled={
          state.matches(FORM_STATES.invalid) ||
          state.matches(FORM_STATES.submitting)
        }
      />
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
