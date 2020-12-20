import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Text from './Text';

const ToggleButton: React.FC<{
  leftOption: {
    label: string;
    value: any;
  };
  rightOption: {
    label: string;
    value: any;
  };
  value: any;
  onPress: (value: any) => any;
}> = ({ leftOption = {}, rightOption = {}, value, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onPress(leftOption.value)}
        style={[
          styles.button,
          { borderBottomLeftRadius: 50, borderTopLeftRadius: 50 },
          value === leftOption.value && styles.active,
        ]}
      >
        <Text
          font="display"
          color={value === leftOption.value ? Colors.offWhite : Colors.primary}
        >
          {leftOption.label}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress(rightOption.value)}
        style={[
          styles.button,
          { borderBottomRightRadius: 50, borderTopRightRadius: 50 },
          value === rightOption.value && styles.active,
        ]}
      >
        <Text
          font="display"
          color={value === rightOption.value ? Colors.offWhite : Colors.primary}
        >
          {rightOption.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    textAlign: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  active: {
    backgroundColor: Colors.primary,
  },
});
