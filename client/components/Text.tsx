import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import Color from '../constants/Colors';
import Fonts from '../constants/Fonts';

interface TextProps extends RNTextProps {
  font?: 'display' | 'text';
  size?: 34 | 17 | 15 | 13;
  color?: Color;
}

const Text: React.FC<TextProps> = ({
  style,
  font = 'text',
  size = 17,
  color = Color.gray,
  ...rest
}) => {
  return (
    <RNText
      style={[{ fontFamily: Fonts[font], fontSize: size, color }, style]}
      {...rest}
    />
  );
};

export default Text;
