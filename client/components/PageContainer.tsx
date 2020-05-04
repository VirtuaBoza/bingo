import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useKeyboardEvent } from '../hooks';

const PageContainer: React.FC<{
  keyboardAvoiding?: boolean;
}> = ({ children, keyboardAvoiding = true }) => {
  const [padding, setPadding] = useState(false);
  useKeyboardEvent('keyboardWillShow', () => {
    setPadding(true);
  });
  useKeyboardEvent('keyboardWillHide', () => {
    setPadding(false);
  });
  return Platform.OS === 'ios' && keyboardAvoiding ? (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.content]}>
          {children}
          {padding ? <View style={styles.bump} /> : null}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  ) : (
    <View style={[styles.container, styles.content]}>{children}</View>
  );
};

export default PageContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  bump: {
    height: 25,
  },
});
