import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const Input = React.forwardRef<any, any>(({ label, style, ...rest }, ref) => {
  return (
    <View style={[style, styles.container]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...rest} ref={ref} />
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 17,
    fontFamily: 'Fugaz-One',
    color: '#F38BA6',
    paddingLeft: 16,
    paddingRight: 16,
  },
  input: {
    fontSize: 17,
    fontFamily: 'Work-Sans',
    borderRadius: 50,
    borderColor: '#F38BA6',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 42,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
