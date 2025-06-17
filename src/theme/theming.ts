import {FontWeight} from './../../node_modules/csstype/index.d';
import {ms, s, vs} from 'react-native-size-matters';
import {getFontSize} from '../constants';

export const sizes = {
  /**
   * normal font size
   */
  text: getFontSize(14),
  /**
   * box radius
   */
  radius: 6,
  /**
   * default margin
   */
  margin: ms(16),
  /**
   * default padding
   */
  padding: ms(16),
  /**
   * default hint font size
   */
  hint: 9,
  /**
   * default icon size
   */
  icon: 24,
  //button
  /**
   * default button width
   */
  buttonWidth: s(343),
  /**
   * default button height
   */
  buttonHeight: vs(40),
  /**
   * default button radius
   */
  buttonRadius: 8,
  /**
   * default button text font size
   */
  buttonText: getFontSize(14),
  /**
   * default button disabled opacity
   */
  buttonDisabledOpacity: 0.5,
  /**
   * default button radius (loading state)
   */
  animateButtonRadius: 100,
  /**
   * default button opacity (loading state)
   */
  animateButtonOpacity: 0.9,
  //input
  /**
   * default input font size
   */
  input: 14,
  /**
   * default input border width
   */
  inputBorder: 1,
  /**
   * default input height
   */
  inputHeight: 50,
  /**
   * default input radius
   */
  inputRadius: 9,
  /**
   * default input max width
   */
  inputMaxWidth: 600,
  /**
   * default input horizontal padding
   */
  inputHorizontalPadding: 12,
  FontWeight: '700',
};

export const fonts = {
  black: '',
  extraBold: '',
  bold: '',
  semiBold: '',
  medium: '',
  regular: '',
  light: '',
  extraLight: '',
  thin: '',
};
