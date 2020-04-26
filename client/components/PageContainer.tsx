import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

function PageContainer({ children }) {
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.content]}>
          {children}
          <View style={styles.bump} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  ) : (
    <View style={[styles.container, styles.content]}>{children}</View>
  );
}

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
    height: 20,
  },
});
