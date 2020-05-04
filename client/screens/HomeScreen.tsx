import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, PageContainer, Stack } from '../components';
import Routes from '../constants/Routes';
import { connect, createRootResetAction, initialState } from '../store';
import MafingoLogo from '../svg/MafingoLogo';

export const HomeScreen: React.FC<any> = ({ navigation, resetStore }) => {
  return (
    <PageContainer keyboardAvoiding={false}>
      <View style={styles.logoContainer}>
        <View style={[StyleSheet.absoluteFill]}>
          <MafingoLogo />
        </View>
      </View>
      <MenuButton
        style={styles.primaryButton}
        title="Join a Game"
        route={Routes.JoinGame}
        navigation={navigation}
      />
      <Stack>
        <MenuButton
          title="Start a New Game"
          route={Routes.NewGame}
          navigation={navigation}
        />
        <MenuButton
          title="My Games"
          route={Routes.Games}
          navigation={navigation}
        />
        {__DEV__ && (
          <Button
            title="Reset State"
            onPress={() => resetStore(initialState)}
          />
        )}
      </Stack>
    </PageContainer>
  );
};

export default connect(null, { resetStore: createRootResetAction })(HomeScreen);

const MenuButton: React.FC<any> = ({ title, route, navigation, ...rest }) => {
  function handlePress() {
    navigation.navigate(route);
  }

  return <Button {...rest} title={title} onPress={handlePress} />;
};

const styles = StyleSheet.create({
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
