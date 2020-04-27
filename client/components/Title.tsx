import React from 'react';
import { StyleSheet, Text } from 'react-native';

const Title: React.FC<{ text: string }> = ({ text }) => {
  return <Text style={styles.title}>{text}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Fugaz-One',
    fontSize: 34,
    color: '#F38BA6',
    alignSelf: 'center',
  },
});
