import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Text from './Text';

const Input = React.forwardRef<React.Props<TextInput>, any>(
  ({ label, style, ...rest }, ref) => {
    return (
      <View style={[style, styles.container]}>
        <Text style={styles.label} font="display" size={17}>
          {label}
        </Text>
        <TextInput style={styles.input} ref={ref} {...rest} />
      </View>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  container: {},
  label: {
    color: Colors.primary,
    paddingLeft: 16,
    paddingRight: 16,
  },
  input: {
    fontSize: 17,
    fontFamily: Fonts.text,
    borderRadius: 50,
    borderColor: Colors.primary,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 42,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
