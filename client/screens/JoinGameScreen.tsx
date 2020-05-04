import { NavigationProp, StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Input, PageContainer, Stack, Title } from '../components';
import Routes from '../constants/Routes';
import {
  FORM_EVENT,
  FORM_STATE,
  useFormStateMachine,
} from '../hooks/useMachine';
import { User } from '../models';
import { gameService, userService } from '../services';
import { connect, selectUser } from '../store';
import {
  createGameUpsertedAction,
  GameUpsertedActionCreator,
} from '../store/reducers/gamesReducer';
import {
  createSetUserAction,
  SetUserActionCreator,
} from '../store/reducers/userReducer';

export const JoinGameScreen: React.FC<{
  user: User;
  addGame: GameUpsertedActionCreator;
  setUser: SetUserActionCreator;
  navigation: NavigationProp<any>;
  route: any;
}> = ({ user, addGame, setUser, navigation, route }) => {
  const [gameId, setGameId] = useState(
    (route.params && route.params.gameId) || ''
  );
  const [userName, setUserName] = useState(user.username || '');
  const [currentState, transition] = useFormStateMachine();
  const nameRef = useRef<any>();
  const gameIdRef = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      if (!userName) {
        nameRef.current.focus();
      } else if (userName && !gameId) {
        gameIdRef.current.focus();
      }
    }, 1);
  }, []);

  useEffect(() => {
    if (gameId.length && userName.length) {
      transition(FORM_EVENT.validate);
    } else {
      transition(FORM_EVENT.invalidate);
    }
  });

  async function joinGame(gameId: string, userId: string) {
    try {
      const game = await gameService.upsertGamePlayer(gameId, userId);
      if (game) {
        addGame(game);
        navigation.dispatch(
          StackActions.replace(Routes.Lobby, { gameId: game.id })
        );
      } else {
        transition(FORM_EVENT.fail);
      }
    } catch (err) {
      if (__DEV__) {
        console.log(err);
      }
      transition(FORM_EVENT.fail);
    }
  }

  async function handleFormSubmit() {
    if (
      currentState.matches(FORM_STATE.valid) ||
      currentState.matches(FORM_STATE.failure)
    ) {
      transition(FORM_EVENT.submit);
      if (!user.id) {
        userService
          .addUser(userName)
          .then((user) => {
            setUser(user);
            joinGame(gameId, user.id);
          })
          .catch((err) => {
            if (__DEV__) {
              console.error(err);
            }
            transition(FORM_EVENT.fail);
          });
      } else {
        joinGame(gameId, user.id);
      }
    }
  }

  function handleSubmit() {
    gameIdRef.current.focus();
  }

  return (
    <PageContainer>
      <View style={styles.container}>
        <Stack>
          <Title text="Join a Game" />
          <Input
            label="Your Name"
            value={userName}
            onChangeText={setUserName}
            editable={!currentState.matches(FORM_STATE.submitting)}
            returnKeyType="next"
            onSubmitEditing={handleSubmit}
            ref={nameRef}
            blurOnSubmit={false}
            selectTextOnFocus
            enablesReturnKeyAutomatically
          />
          <Input
            label="Game Code"
            value={gameId}
            onChangeText={setGameId}
            editable={!currentState.matches(FORM_STATE.submitting)}
            returnKeyType="go"
            onSubmitEditing={handleFormSubmit}
            ref={gameIdRef}
            autoCapitalize="none"
            autoCorrect={false}
            selectTextOnFocus
            enablesReturnKeyAutomatically
          />
          <ActivityIndicator
            animating={currentState.matches(FORM_STATE.submitting)}
            size="large"
          />
          {currentState.matches(FORM_STATE.failure) && <Text>No bueno.</Text>}
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
};

export default connect(() => ({ user: selectUser }), {
  setUser: createSetUserAction,
  addGame: createGameUpsertedAction,
})(JoinGameScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  submitButton: {
    width: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
