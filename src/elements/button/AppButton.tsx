import React from 'react';

import Ripple from './Ripple';
import {useThemeContext} from '../../hook/contextHook';
import {sizes} from '../../theme/theming';
import {type AppButtonProps} from './ButtonProps';
import ButtonLoading from './ButtonLoading';
import {AppText} from '../text/AppText';
import {StyleSheet} from 'react-native';
import {handleButtonStarlingStyle} from '../../helper/styleHelper';

export function AppButton(_props: AppButtonProps) {
  const {colors} = useThemeContext();

  if (_props?.processing !== undefined) {
    return <ButtonLoading {..._props} />;
  }

  const props = {
    ..._props,

    disabledOpacity: _props.disabledOpacity ?? sizes.buttonDisabledOpacity,
  };

  if (!props.reset) {
    props.width = _props.width ?? sizes.buttonWidth;
    props.height = _props.height ?? sizes.buttonHeight;
  }

  const {elementProps, elementStyles} = handleButtonStarlingStyle(
    props,
    colors,
  );

  let textColor = props.textColor ?? 'text';
  if (!props.textColor && props.primary) {
    textColor = 'white';
  }

  return (
    <Ripple
      {...elementProps}
      rippleContainerBorderRadius={
        typeof props.radius === 'boolean' ? sizes.radius : props.radius
      }
      style={[
        !props.reset && styles.button,
        elementStyles,
        props.disabled && props.disabledStyle,
      ]}>
      {props.children || (
        <AppText
          weight="700"
          adjustsFontSizeToFit
          textAlign="center"
          size={sizes.buttonText}
          style={props.textStyle}
          color={textColor}>
          {props.text || ''}
        </AppText>
      )}
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {alignItems: 'center', justifyContent: 'center', borderRadius: 8},
});
