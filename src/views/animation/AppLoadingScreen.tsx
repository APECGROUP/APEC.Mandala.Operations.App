// elements/common/AppLoadingScreen.tsx
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import LoadingAnimation from './LoadingAnimation';

export type AppLoadingScreenRef = {
  show: () => void;
  hide: () => void;
};

const AppLoadingScreen = forwardRef<AppLoadingScreenRef>((_, ref) => {
  const opacity = useSharedValue(1);
  const [visible, setVisible] = useState(true);

  useImperativeHandle(ref, () => ({
    show() {
      setVisible(true);
      opacity.value = withTiming(1);
    },
    hide() {
      opacity.value = withTiming(0, {duration: 500}, finished => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      });
    },
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Reanimated.View style={[styles.container, animatedStyle]}>
      <LoadingAnimation autoPlay />
    </Reanimated.View>
  );
});

export default AppLoadingScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    right: 0,
    left: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
