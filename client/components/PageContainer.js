import React from 'react';
import { StyleSheet, View } from 'react-native';

function PageContainer({ style, ...rest }) {
  return <View style={[style, styles.container]} {...rest} />;
}

export default PageContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
});
