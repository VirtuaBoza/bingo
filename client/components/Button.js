import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function Button({ title, style, onPress, disabled }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, style, disabled && styles.disabled]}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default Button;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F38BA6',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 250,
    alignSelf: 'center',
  },
  disabled: {
    backgroundColor: '#F7BDC9',
  },
  text: {
    fontFamily: 'Fugaz-One',
    color: '#FFEEEE',
    fontSize: 17,
  },
});
