import { useLayoutEffect } from 'react';
import { Keyboard } from 'react-native';

export default function useKeyboardEvent(event, callback) {
  useLayoutEffect(() => {
    Keyboard.addListener(event, callback);
    return () => {
      Keyboard.removeListener(event, callback);
    };
  });
}
