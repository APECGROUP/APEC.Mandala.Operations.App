import React, {forwardRef} from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';

interface ConfettiAnimationProps {
  source?: any;
  style?: object;
  autoPlay?: boolean;
  loop?: boolean;
}

const ConfettiAnimation = forwardRef<LottieView, ConfettiAnimationProps>(
  ({source, style, autoPlay = false, loop = true}, ref) => {
    return (
      <LottieView
        ref={ref}
        source={source || require('../animation/source/ConfettiAnimation.json')}
        style={[styles.size, style]}
        autoPlay={autoPlay}
        loop={loop}
      />
    );
  },
);

export default ConfettiAnimation;

const styles = StyleSheet.create({
  size: {
    width: '100%',
    aspectRatio: 1,
    // height: '100%',
  },
});
