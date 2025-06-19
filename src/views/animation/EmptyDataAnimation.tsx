import React, {forwardRef} from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';

interface EmptyDataAnimationProps {
  source?: any;
  style?: object;
  autoPlay?: boolean;
  loop?: boolean;
}

const EmptyDataAnimation = forwardRef<LottieView, EmptyDataAnimationProps>(
  ({source, style, autoPlay = false, loop = true}, ref) => (
      <LottieView
        ref={ref}
        source={
          source || require('../animation/source/EmptyDataAnimation.json')
        }
        style={[styles.size, style]}
        autoPlay={autoPlay}
        loop={loop}
      />
    ),
);

export default EmptyDataAnimation;

const styles = StyleSheet.create({
  size: {
    width: '100%',
    aspectRatio: 1.4,
    // height: '100%',
  },
});
