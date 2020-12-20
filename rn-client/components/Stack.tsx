import React from 'react';
import { StyleSheet, View } from 'react-native';

const Stack: React.FC<any> = ({ children, style, ...rest }) => {
  return (
    <View style={style} {...rest}>
      {React.Children.map(children, (child, i) =>
        i + 1 < React.Children.count(children) ? (
          <View style={styles.child}>{child}</View>
        ) : (
          child
        )
      )}
    </View>
  );
};

export default Stack;

const styles = StyleSheet.create({
  child: {
    marginBottom: 20,
  },
});
