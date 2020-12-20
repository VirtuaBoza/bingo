import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Text from './Text';

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
        font="display"
        size={17}
        color={disabled ? Colors.secondary : Colors.primary}
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
      <Text font="display" size={17} color={Colors.offWhite}>
        {title}
      </Text>
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
});
