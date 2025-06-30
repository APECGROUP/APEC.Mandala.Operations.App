import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface SkeletonItemProps {
  showWaiting?: boolean;
}

const SkeletonItem = ({ showWaiting = false }: SkeletonItemProps) => {
  const opacity = useSharedValue(0.3);

  // Tối ưu animation với useCallback
  const startAnimation = useCallback(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 1000 }), withTiming(0.3, { duration: 1000 })),
      -1, // Infinite loop
      false, // Don't reverse
    );
  }, [opacity]);

  // Start animation on mount
  React.useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  // Animated styles với Reanimated 3
  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedPrCodeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedIcon1Style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedIcon2Style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedDateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedWaitingStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.card}>
      {/* Icon skeleton */}
      <Animated.View style={[styles.itemIcon, animatedIconStyle]} />

      <View style={styles.itemInfo}>
        <View style={styles.itemInfoRow}>
          {/* PR Code skeleton */}
          <Animated.View style={[styles.prCodeSkeleton, animatedPrCodeStyle]} />

          {/* Note icon skeleton */}
          <Animated.View style={[styles.iconSkeleton, animatedIcon1Style]} />

          {/* Info icon skeleton */}
          <Animated.View style={[styles.iconSkeleton, animatedIcon2Style]} />
        </View>

        {/* Date/User name skeleton */}
        <Animated.View style={[styles.dateSkeleton, animatedDateStyle]} />

        {/* Waiting badge skeleton */}
        {showWaiting && <Animated.View style={[styles.blockWaiting, animatedWaitingStyle]} />}
      </View>
    </View>
  );
};

export default SkeletonItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: s(8),
    padding: s(12),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  itemIcon: {
    width: s(40),
    height: vs(40),
    borderRadius: s(8),
    marginRight: s(12),
    backgroundColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  prCodeSkeleton: {
    width: '70%',
    height: vs(16),
    backgroundColor: '#E0E0E0',
    borderRadius: s(4),
    marginRight: s(6),
  },
  iconSkeleton: {
    width: s(16),
    height: s(16),
    backgroundColor: '#E0E0E0',
    borderRadius: s(2),
    marginHorizontal: s(3),
  },
  dateSkeleton: {
    width: '50%',
    height: vs(14),
    backgroundColor: '#E0E0E0',
    borderRadius: s(4),
  },
  blockWaiting: {
    paddingVertical: vs(2),
    paddingHorizontal: s(4),
    borderRadius: s(4),
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
    marginTop: vs(6),
    width: s(80),
    height: vs(20),
  },
});
