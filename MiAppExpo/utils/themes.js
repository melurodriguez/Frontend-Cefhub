import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const sizes = {
  width,
  height,
  padding: 16,
  margin: 16,
  radius: 12,
};

export const fonts = {
  small: 14,
  medium: 18,
  large: 24,
};

export default { sizes, fonts };
