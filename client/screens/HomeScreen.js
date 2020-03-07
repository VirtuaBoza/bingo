import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Routes from '../constants/Routes';
import { connect, initialState } from '../store';
import { createRootResetAction } from '../store/reducers';

export default connect(null, { resetStore: createRootResetAction })(HomeScreen);

export function HomeScreen({ navigation, resetStore }) {
  return (
    <View style={styles.container}>
      <Button
        title="Start a New Game"
        onPress={() => navigation.navigate(Routes.NewGame)}
      />
      <Button
        title="My Games"
        onPress={() => navigation.navigate(Routes.Games)}
      />
      {__DEV__ && (
        <Button title="Reset State" onPress={() => resetStore(initialState)} />
      )}
    </View>
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
