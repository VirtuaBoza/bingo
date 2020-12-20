import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

const Title: React.FC<{ text: string }> = ({ text }) => {
  return <Text style={styles.title}>{text}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.display,
    fontSize: 34,
    color: Colors.primary,
    alignSelf: 'center',
  },
});
