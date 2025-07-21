import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { SCREEN_WIDTH } from '@/constants';
import light from '@/theme/light';

const NotificationSkeletonHk = () => {
  const opacity = useSharedValue(0.3);

  opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* IconNotification */}
      <View style={styles.icon} />

      {/* Text block */}
      <View style={styles.textBlock}>
        <View style={styles.lineTime} />
        <View style={styles.lineTitle} />
        <View style={styles.lineContent} />
      </View>

      {/* Icon3Dot */}
      <View style={styles.icon3Dot} />
    </Animated.View>
  );
};

export default NotificationSkeletonHk;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: light.border,
  },
  icon: {
    width: vs(24),
    height: vs(24),
    borderRadius: vs(12),
    backgroundColor: light.placeholder,
  },
  textBlock: {
    marginLeft: s(4),
    width: SCREEN_WIDTH - s(85), // same logic as AppBlock ml={4} width={SCREEN_WIDTH - s(85)}
  },
  lineTime: {
    width: '40%',
    height: vs(10),
    borderRadius: 4,
    backgroundColor: light.placeholder,
    marginBottom: vs(4),
  },
  lineTitle: {
    width: '70%',
    height: vs(12),
    borderRadius: 4,
    backgroundColor: light.placeholder,
    marginBottom: vs(4),
  },
  lineContent: {
    width: '90%',
    height: vs(10),
    borderRadius: 4,
    backgroundColor: light.placeholder,
  },
  icon3Dot: {
    marginLeft: 'auto',
    width: vs(18),
    height: vs(18),
    borderRadius: vs(9),
    backgroundColor: light.placeholder,
  },
});
