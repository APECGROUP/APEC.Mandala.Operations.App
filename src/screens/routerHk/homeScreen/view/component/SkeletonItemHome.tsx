import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { s, vs } from 'react-native-size-matters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '@/theme/Config';
import { PaddingHorizontal } from '@/utils/Constans';

const SkeletonItemHome = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 1000 }), withTiming(0.3, { duration: 1000 })),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Component cho một phòng
  // eslint-disable-next-line react/no-unstable-nested-components
  const RoomSkeleton = React.memo(() => (
    <View style={styles.roomCard}>
      {/* Số phòng */}
      <Animated.View style={[styles.roomNumber, animatedStyle]} />
      {/* Số khách */}
      <Animated.View style={[styles.guestNumber, animatedStyle]} />
      {/* Divider */}
      <View style={styles.divider} />
      {/* Icon section */}
      <View style={styles.iconSection}>
        <Animated.View style={[styles.icon, animatedStyle]} />
        <View style={styles.iconDivider} />
        <Animated.View style={[styles.icon, animatedStyle]} />
      </View>
      {/* Flag icon (góc trái trên) */}
      <Animated.View style={[styles.flagIcon, animatedStyle]} />
    </View>
  ));

  return (
    <View style={styles.container}>
      {/* Header của tầng */}
      <View style={styles.floorHeader}>
        <Animated.View style={[styles.floorTitle, animatedStyle]} />
        <Animated.View style={[styles.floorArrow, animatedStyle]} />
      </View>

      {/* Danh sách phòng */}
      <View style={styles.roomList}>
        {new Array(9).fill(0).map((_, index) => (
          <RoomSkeleton key={index} />
        ))}
      </View>
    </View>
  );
};

export default SkeletonItemHome;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: PaddingHorizontal,
  },
  floorHeader: {
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: PaddingHorizontal,
    borderWidth: 0.3,
    borderColor: '#E0E0E0',
  },
  floorTitle: {
    width: s(80),
    height: vs(20),
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  floorArrow: {
    width: s(20),
    height: vs(20),
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  roomList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingHorizontal / 2,
    paddingTop: vs(16),
  },
  roomCard: {
    backgroundColor: Colors.WHITE,
    width: '28%', // Giảm từ 30% xuống 28%
    marginHorizontal: '2.65%', // Tăng margin để cân bằng khoảng cách
    marginBottom: vs(12),
    borderRadius: 8,
    paddingVertical: vs(14), // Tăng từ 10 lên 14
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    alignItems: 'center',
    position: 'relative',
  },
  roomNumber: {
    width: s(50),
    height: vs(14),
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  guestNumber: {
    width: s(25),
    height: vs(12),
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: vs(4),
  },
  divider: {
    height: 0.3,
    width: '80%',
    backgroundColor: '#E0E0E0',
    marginTop: vs(4),
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  icon: {
    width: s(24),
    height: vs(24),
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  iconDivider: {
    height: vs(20),
    width: 0.5,
    backgroundColor: '#E0E0E0',
  },
  flagIcon: {
    position: 'absolute',
    top: vs(4),
    left: s(4),
    width: s(14),
    height: vs(14),
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
});
