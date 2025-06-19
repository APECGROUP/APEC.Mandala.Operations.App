import React, {Component} from 'react';
import {Text as RNText} from 'react-native';

import {type AppTextProps} from './TextProps';
import StarlingThemeContext from '../../theme/ThemeContext';
import type {StarlingTheme} from '../../theme/type';
import {handleTextStarlingStyle} from '../../helper/styleHelper';
import type {TextProps, StyleProp, TextStyle} from 'react-native';

type FontWeightType =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'normal'
  | 'bold';

const weightToFontMap: Record<FontWeightType, string> = {
  '100': 'GoogleSans-Regular',
  '200': 'GoogleSans-Regular',
  '300': 'GoogleSans-Regular',
  '400': 'GoogleSans-Regular',
  '500': 'GoogleSans-Medium',
  '600': 'GoogleSans-Medium',
  '700': 'GoogleSans-Bold',
  '800': 'GoogleSans-Bold',
  '900': 'GoogleSans-Bold',
  normal: 'GoogleSans-Regular',
  bold: 'GoogleSans-Bold',
};

export class AppText extends Component<AppTextProps & TextProps> {
  static contextType = StarlingThemeContext;
  static defaultProps = {
    allowFontScaling: false,
  };

  context: StarlingTheme = {} as StarlingTheme;

  render() {
    const {elementProps, elementStyles} = handleTextStarlingStyle(
      this.props,
      this.context.colors,
    );

    let finalStyles: StyleProp<TextStyle> = elementStyles;

    // Chỉ xử lý fontWeight nếu có trong style
    if (elementStyles) {
      let fontWeight: FontWeightType | undefined;

      if (Array.isArray(elementStyles)) {
        for (const style of elementStyles) {
          if (style?.fontWeight) {
            fontWeight = style.fontWeight as FontWeightType;
            break;
          }
        }
      } else if (elementStyles.fontWeight) {
        fontWeight = elementStyles.fontWeight as FontWeightType;
      }

      // Chỉ áp dụng fontFamily mới nếu có fontWeight
      if (fontWeight && weightToFontMap[fontWeight]) {
        const fontFamily = weightToFontMap[fontWeight];
        const cleanStyles = Array.isArray(elementStyles)
          ? elementStyles.map(style => {
              if (style && typeof style === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {fontWeight: removedWeight, ...rest} = style;
                return rest;
              }
              return style;
            })
          : {...elementStyles, fontWeight: undefined};

        finalStyles = [cleanStyles, {fontFamily}];
      }
    }

    return (
      <RNText {...elementProps} style={finalStyles}>
        {this.props.children}
      </RNText>
    );
  }
}
