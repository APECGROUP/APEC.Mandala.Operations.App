import React, {forwardRef} from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';

interface LoadingAnimationProps {
  source?: any;
  style?: object;
  autoPlay?: boolean;
  loop?: boolean;
}

const LoadingAnimation = forwardRef<LottieView, LoadingAnimationProps>(
  ({source, style, autoPlay = false, loop = true}, ref) => {
    return (
      <LottieView
        ref={ref}
        source={source || require('../animation/source/LoadingAnimation.json')}
        style={[styles.size, style]}
        autoPlay={autoPlay}
        loop={loop}
      />
    );
  },
);

export default LoadingAnimation;

const styles = StyleSheet.create({
  size: {
    width: '100%',
    height: '100%',
  },
});
