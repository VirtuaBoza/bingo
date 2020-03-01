import * as React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';

function Item({text}) {
  return (
    <View style={styles.item}>
      <Text>{text}</Text>
    </View>);
}

function ItemSeparator() {
  return <View style={styles.itemSeparator}/>;
}

function TileSelector({filename}) {
  return (
    <TouchableOpacity>
      {filename === '3x3wfree'
        ? <Image source={require('../assets/images/3x3wfree.png')} style={styles.tileImage}/>
        : filename === '3x3'
        ? <Image source={require('../assets/images/3x3.png') } style={styles.tileImage}/>
        : filename === '4x4'
        ? <Image source={require('../assets/images/4x4.png') } style={styles.tileImage}/>
        : filename === '5x5wfree'
        ? <Image source={require('../assets/images/5x5wfree.png') } style={styles.tileImage}/>
        : filename === '5x5'
        ? <Image source={require('../assets/images/5x5.png') } style={styles.tileImage}/>
        : null
      }
    </TouchableOpacity>
  );
}

export default function NewGameScreen() {
  const [value, setValue] = React.useState('');
  const [items, setItems] = React.useState([]);
  const ref = React.useRef();

  function handleSubmitValue() {
    if (value.trim() && !items.find(i => i === value)) {
      setItems(i => [...i, value.trim()]);
    }
    setValue('');
    setTimeout(() => {
      ref.current.focus();
    }, 1);
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.tileSelectContainer}>
        <ScrollView horizontal={true}>
          {items.length >= 8 && <TileSelector filename="3x3wfree"/>}
          {items.length >= 9 && <TileSelector filename="3x3"/>}
          {items.length >= 16 && <TileSelector filename="4x4"/>}
          {items.length >= 24 && <TileSelector filename="5x5wfree"/>}
          {items.length >= 25 && <TileSelector filename="5x5"/>}
        </ScrollView>
      </View>
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
    </View>
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
  },
  tileImage: {
    height: 50,
    width: 50,
  },
  tileSelectContainer: {
    height: 60,
  },
  debug1: {
    backgroundColor: 'red',
  },
  debug2: {
    backgroundColor: 'blue',
  }
});