import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Input, PageContainer, Stack, Title } from '../components';
import Routes from '../constants/Routes';
import {
  FORM_EVENT,
  FORM_STATE,
  useFormStateMachine,
} from '../hooks/useMachine';
import gameService from '../services/mockGameService';
import { connect, selectUser } from '../store';
import { createGameUpsertedAction } from '../store/reducers/gamesReducer';
import { createSetUsernameAction } from '../store/reducers/userReducer';

export default connect(() => ({ user: selectUser }), {
  setUsername: createSetUsernameAction,
  addGame: createGameUpsertedAction,
})(NewGameScreen);

export function NewGameScreen({ user, navigation, setUsername, addGame }) {
  const [gameName, setGameName] = useState('');
  const [internalUserName, setInternalUserName] = useState(user.username || '');
  const ref = useRef();
  const [currentState, transition] = useFormStateMachine();

  useEffect(() => {
    if (internalUserName) {
      setTimeout(() => {
        ref.current.focus();
      }, 1);
    }
  }, []);

  useEffect(() => {
    if (gameName.length && internalUserName.length) {
      transition(FORM_EVENT.validate);
    } else {
      transition(FORM_EVENT.invalidate);
    }
  });

  function handleUsernameSubmit() {
    ref.current.focus();
  }

  function handleFormSubmit() {
    if (
      !currentState.matches(FORM_STATE.invalid) &&
      !currentState.matches(FORM_STATE.submitting)
    ) {
      setUsername(internalUserName);
      transition(FORM_EVENT.submit);
      gameService
        .createGame(gameName, internalUserName)
        .then((game) => {
          addGame(game);
          navigation.dispatch(
            StackActions.replace(Routes.Lobby, { gameId: game._id })
          );
        })
        .catch((err) => {
          if (__DEV__) {
            console.error(err);
          }
          transition(FORM_EVENT.fail);
        });
    }
  }

  return (
    <PageContainer>
      <View style={styles.container}>
        <Stack>
          <Title text="Start a New Game" />
          <Input
            label="Your Name"
            value={internalUserName}
            onChangeText={setInternalUserName}
            editable={!currentState.matches(FORM_STATE.submitting)}
            returnKeyType="next"
            onSubmitEditing={handleUsernameSubmit}
            blurOnSubmit={false}
            selectTextOnFocus
            enablesReturnKeyAutomatically
            autoFocus
          />
          <Input
            label="Game Name"
            value={gameName}
            onChangeText={setGameName}
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
          {currentState.matches(FORM_STATE.failure) && (
            <Text>Something went wrong.</Text>
          )}
        </Stack>
        <Button
          title="Let's Go!"
          onPress={handleFormSubmit}
          style={styles.submitButton}
          disabled={
            currentState.matches(FORM_STATE.invalid) ||
            currentState.matches(FORM_STATE.submitting)
          }
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  submitButton: {
    width: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
