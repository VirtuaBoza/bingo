import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

function PageContainer({ style, children, ...rest }) {
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      behavior="padding"
      style={[style, styles.container]}
      {...rest}
    >
      {children}
      <View style={styles.bump} />
    </KeyboardAvoidingView>
  ) : (
    <View style={[style, styles.container]} {...rest}>
      {children}
    </View>
  );
}

export default PageContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  bump: {
    height: 20,
  },
});
