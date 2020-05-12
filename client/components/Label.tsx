import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';

const Label: React.FC<any> = ({ text, style, ...rest }) => {
  return (
    <Text {...rest} style={[styles.label, style]}>
      {text}
    </Text>
  );
};

export default Label;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Fugaz-One',
    fontSize: 17,
    color: Colors.gray,
  },
});
