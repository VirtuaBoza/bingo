import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Stack } from '../components';
import Routes from '../constants/Routes';
import { connect, initialState } from '../store';
import { createRootResetAction } from '../store/reducers';
import MafingoLogo from '../svg/MafingoLogo';

export default connect(null, { resetStore: createRootResetAction })(HomeScreen);

export function HomeScreen({ navigation, resetStore }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={[StyleSheet.absoluteFill]}>
          <MafingoLogo />
        </View>
      </View>
      <Button
        style={styles.primaryButton}
        title="Join a Game"
        onPress={() => navigation.navigate(Routes.JoinGame)}
      />
      <Stack>
        <Button
          title="Start a New Game"
          onPress={() => navigation.navigate(Routes.NewGame)}
        />
        <Button
          title="My Games"
          onPress={() => navigation.navigate(Routes.Games)}
        />
        {__DEV__ && (
          <Button
            title="Reset State"
            onPress={() => resetStore(initialState)}
          />
        )}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'stretch',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  primaryButton: {
    width: 300,
    marginBottom: 20,
  },
});
