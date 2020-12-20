import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

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
    fontFamily: Fonts.display,
    fontSize: 17,
    color: Colors.gray,
  },
});
