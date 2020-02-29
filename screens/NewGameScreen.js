import * as React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TextInput, ScrollView } from 'react-native';

function Item({text}) {
  return (
    <View style={styles.item}>
      <Text>{text}</Text>
    </View>);
}

function ItemSeparator() {
  return <View style={styles.itemSeparator}/>;
}

export default function NewGameScreen() {
  const [value, setValue] = React.useState('');
  const [items, setItems] = React.useState([]);
  const ref = React.useRef();

  function handleSubmitValue() {
    if (!items.find(i => i === value)) {
      setItems(i => [...i, value]);
    }
    setValue('');
    setTimeout(() => {
      ref.current.focus();
    }, 1);
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.item}
        value={value}
        onChangeText={text => setValue(text)}
        onSubmitEditing={handleSubmitValue}
        ref={ref}
        autoFocus
      />
      <FlatList
        data={items}
        renderItem={({item}) => <Item text={item} />}
        keyExtractor={item => item}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}


NewGameScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 20,
  },
  itemSeparator: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  editItem: {
    backgroundColor: 'lightgray',
    padding: 20,
  }
});