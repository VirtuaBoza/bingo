import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Routes from '../constants/Routes';

export default function HomeScreen({ navigation }) {
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
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

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
