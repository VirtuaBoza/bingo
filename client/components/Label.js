import React from 'react';
import { StyleSheet, Text } from 'react-native';

function Label({ text, style, ...rest }) {
  return (
    <Text {...rest} style={[styles.label, style]}>
      {text}
    </Text>
  );
}

export default Label;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Fugaz-One',
    fontSize: 17,
    color: '#646464',
  },
});
