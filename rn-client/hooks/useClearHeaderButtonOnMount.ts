import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';

export default (navigation: NavigationProp<any>) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
    });
  }, []);
};
