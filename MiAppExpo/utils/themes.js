import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const sizes = {
  width,
  height,
  padding: 16,
  margin: 16,
  radius: 15,
};

export const fonts = {
  small: 15,
  medium: 20,
  large: 24,
  bold:"700"
};

export const colors={
  primary:"#505c86",
  secondary:"#FFF2E5",
  backgroundColorLight:"#f1f5f5",
  backgroundColorDark:"#E5CFB8",
  white:"#fff",
  black:"#000",
  red:"#DA0404",
  orange:"#c45335"
}

export default { sizes, fonts, colors };
