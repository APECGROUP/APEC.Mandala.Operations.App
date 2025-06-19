import React, { forwardRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';

interface DevelopingAnimationProps {
  source?: any;
  style?: object;
  autoPlay?: boolean;
  loop?: boolean;
}

const DevelopingAnimation = forwardRef<LottieView, DevelopingAnimationProps>(
  ({ source, style, autoPlay = false, loop = true }, ref) => (
      <LottieView
        ref={ref}
        source={source || require('../animation/source/DevelopingAnimation.json')}
        style={[styles.size, style]}
        autoPlay={autoPlay}
        loop={loop}
      />
    ),
);

export default DevelopingAnimation;

const styles = StyleSheet.create({
  size: {
    width: '100%',
    aspectRatio: 1,
    // height: '100%',
  },
});
