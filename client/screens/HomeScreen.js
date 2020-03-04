import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Button
          title="Start a New Game"
          onPress={() => navigation.navigate('New Game')}
        />
      </ScrollView>
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
  },
  contentContainer: {
    paddingTop: 30,
  },
});
