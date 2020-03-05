import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function LobbyScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { game } = route.params;
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const ref = useRef();

  useEffect(() => {
    navigation.setOptions({ title: `${game.name}` });
    if (ref.current) {
      setTimeout(() => {
        ref.current.focus();
      });
    }
    const keyboardRemoveListener = Keyboard.addListener(
      'keyboardDidHide',
      handleEndEditing
    );
    () => {
      keyboardRemoveListener.remove();
    };
  });

  function handleAddTermClick() {
    setTerms([...terms, '']);
  }

  function handleEndEditing() {
    setTerms(
      [...terms, newTerm].filter(
        (term, index, self) => term && self.indexOf(term) === index
      )
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={terms}
          renderItem={({ item }) => (
            <View>
              {item ? (
                <Text>{item}</Text>
              ) : (
                <TextInput
                  onEndEditing={handleEndEditing}
                  onChangeText={setNewTerm}
                  ref={ref}
                />
              )}
            </View>
          )}
          keyExtractor={item => item}
        />
      </View>
      <Button title="Add Term" onPress={handleAddTermClick} />
    </View>
  );
}

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
