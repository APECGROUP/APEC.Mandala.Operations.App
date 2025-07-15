import React, { useEffect, useState, useMemo } from 'react';
import { Platform, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import Ripple from './Ripple';
import { useThemeContext } from '../../hook/contextHook';
import { type ButtonLoadingProps } from './ButtonProps';
import { sizes } from '../../theme/theming';
import { AppText } from '../text/AppText';
import { AppBlock } from '../block/Block';
import { handleButtonStarlingStyle } from '../../helper/styleHelper';

const AnimatedText = Animated.createAnimatedComponent(AppText);
export const AnimatedButton = Animated.createAnimatedComponent(Ripple);

export default function ButtonLoading(props: ButtonLoadingProps) {
  const {
    processing,
    width = sizes.buttonWidth,
    height = sizes.buttonHeight,
    radius = sizes.radius,
    animateCenter = true,
    animateRadius = sizes.animateButtonRadius,
    animateOpacity = sizes.animateButtonOpacity,
    animateWidth,
    primary,
    disabled,
    disabledStyle,
    text,
    textColor,
    textStyle,
  } = props;

  const maxWidth = width;
  const { colors } = useThemeContext();

  const borderRadius = typeof radius === 'number' ? radius : sizes.radius;

  const [isLoading, setIsLoading] = useState(false);

  const minWidth = animateWidth ?? height ?? (Platform.OS === 'ios' ? 60 : 50);

  useEffect(() => {
    if (processing) {
      setIsLoading(true);
    } else if (isLoading) {
      setTimeout(() => setIsLoading(false), 1200);
    }
  }, [processing, isLoading]);

  const animTextStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withTiming(isLoading ? 0 : 1, { duration: 450 }) }],
    }),
    [isLoading],
  );

  const children = isLoading ? (
    <ActivityIndicator animating color={primary ? colors.white : colors.buttonText} />
  ) : (
    props.children ?? (
      <AnimatedText
        adjustsFontSizeToFit
        textAlign="center"
        // size={sizes.buttonText}
        style={[textStyle, animTextStyle]}
        color={textColor}>
        {text || ''}
      </AnimatedText>
    )
  );

  const { elementStyles, elementProps } = useMemo(
    () => handleButtonStarlingStyle({ ...props, width, height, radius }, colors),
    [props, width, height, radius, colors],
  );

  const animStyle = useAnimatedStyle(
    () => ({
      borderRadius: withTiming(isLoading ? animateRadius : borderRadius, {
        duration: 650,
      }),
      width: withTiming(isLoading ? minWidth : maxWidth, { duration: 450 }),
      opacity: withTiming(isLoading ? animateOpacity : 1, { duration: 450 }),
    }),
    [isLoading],
  );

  return (
    <AppBlock center={animateCenter}>
      <AnimatedButton
        {...elementProps}
        rippleContainerBorderRadius={borderRadius}
        disabled={disabled || processing || isLoading}
        style={[
          styles.button,
          elementStyles,
          animStyle,
          (isLoading || disabled || processing) && styles.opacity,
          disabled && disabledStyle,
        ]}>
        {children}
      </AnimatedButton>
    </AppBlock>
  );
}

const styles = StyleSheet.create({
  opacity: { opacity: 0.3 },
  button: { alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
});
