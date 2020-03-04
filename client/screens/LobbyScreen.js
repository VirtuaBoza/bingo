import React from 'react';
import { Text, View } from 'react-native';

export default function LobbyScreen({ route }) {
  const { game } = route.params;
  return (
    <View>
      <Text>{game._id}</Text>
    </View>
  );
}
