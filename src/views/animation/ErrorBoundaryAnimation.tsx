import React, { forwardRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';

interface ErrorBoundaryAnimationProps {
  source?: any;
  style?: object;
  autoPlay?: boolean;
  loop?: boolean;
}

const ErrorBoundaryAnimation = forwardRef<LottieView, ErrorBoundaryAnimationProps>(
  ({ source, style, autoPlay = true, loop = true }, ref) => (
    <LottieView
      ref={ref}
      source={source || require('../animation/source/ErrorBoundary.json')}
      style={[styles.size, style]}
      autoPlay={autoPlay}
      loop={loop}
    />
  ),
);

export default ErrorBoundaryAnimation;

const styles = StyleSheet.create({
  size: {
    width: '100%',
    // height: '100%',
    aspectRatio: 1,
  },
});
