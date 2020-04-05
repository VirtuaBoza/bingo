import React from 'react';
import { StyleSheet, Text } from 'react-native';

function Label({ text }) {
  return <Text style={styles.label}>{text}</Text>;
}

export default Label;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Fugaz-One',
    fontSize: 17,
    color: '#646464',
  },
});
