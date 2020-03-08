import React from 'react';
import { Button, StyleSheet } from 'react-native';
import Stack from '../components/Stack';
import Routes from '../constants/Routes';
import { connect, initialState } from '../store';
import { createRootResetAction } from '../store/reducers';

export default connect(null, { resetStore: createRootResetAction })(HomeScreen);

export function HomeScreen({ navigation, resetStore }) {
  return (
    <Stack style={styles.container}>
      <Button
        title="Start a New Game"
        onPress={() => navigation.navigate(Routes.NewGame)}
      />
      <Button
        title="Join Game"
        onPress={() => navigation.navigate(Routes.JoinGame)}
      />
      <Button
        title="My Games"
        onPress={() => navigation.navigate(Routes.Games)}
      />
      {__DEV__ && (
        <Button title="Reset State" onPress={() => resetStore(initialState)} />
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    paddingTop: 30,
  },
});
