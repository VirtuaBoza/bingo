import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

const Button: React.FC<any> = ({
  title,
  style,
  onPress,
  disabled,
  borderless,
}) => {
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
};

export default Button;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 250,
    alignSelf: 'center',
  },
  disabled: {
    backgroundColor: Colors.secondary,
  },
  text: {
    fontFamily: 'Fugaz-One',
    color: Colors.offWhite,
    fontSize: 17,
  },
  borderlessText: {
    color: Colors.primary,
    fontFamily: 'Fugaz-One',
    fontSize: 17,
  },
  borderlessDisabled: {
    color: Colors.secondary,
  },
});
