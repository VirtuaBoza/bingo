import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

function Button({ title, style, onPress, disabled, borderless }) {
  return borderless ? (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={style}>
      <Text
        style={[styles.borderlessText, disabled && styles.borderlessDisabled]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
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
  borderlessText: {
    color: '#F38BA6',
    fontFamily: 'Fugaz-One',
    fontSize: 17,
  },
  borderlessDisabled: {
    color: '#F7BDC9',
  },
});
