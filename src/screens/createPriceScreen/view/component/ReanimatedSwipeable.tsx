import React, {ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
  // 💡 Thêm useAnimatedReaction nếu bạn muốn kiểm soát opacity chặt chẽ hơn
  useAnimatedReaction,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {s} from 'react-native-size-matters';

const SWIPE_WIDTH = -s(50);
const SWIPE_THRESHOLD = SWIPE_WIDTH;

type Props = {
  children: ReactNode;
  renderRightActions?: () => ReactNode;
  onSwipe?: () => void;
  simultaneousGesture: any;
};

const ReanimatedSwipeable = ({
  children,
  renderRightActions,
  onSwipe,
  simultaneousGesture,
}: Props) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  // 💡 Cải thiện logic quản lý opacity
  // Sử dụng useAnimatedReaction để theo dõi translateX và điều khiển opacity
  useAnimatedReaction(
    () => translateX.value, // Theo dõi giá trị của translateX
    (currentValue, previousValue) => {
      // Khi translateX đang di chuyển sang trái (mở)
      if (currentValue < 0 && previousValue! >= 0) {
        // Đảm bảo opacity = 1 khi bắt đầu mở
        opacity.value = withTiming(1, {duration: 150});
      }
      // Khi translateX đang đóng lại hoàn toàn về 0
      else if (currentValue >= -5 && previousValue! < -5) {
        // Threshold nhỏ để bắt sự kiện đóng
        opacity.value = withTiming(0, {duration: 300}); // Thời gian khớp với animation đóng
      }
    },
    [], // Dependency array rỗng vì chúng ta chỉ quan tâm đến translateX.value
  );

  const panGesture = Gesture.Pan()
    .minDistance(5)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      // 💡 BỎ: Không cần đặt opacity ở đây nữa, useAnimatedReaction sẽ lo
      // opacity.value = withTiming(1, {duration: 150});

      // 💡 GIỮ: Đảm bảo item đóng nếu đang mở và bắt đầu cử chỉ mới
      if (translateX.value !== 0) {
        translateX.value = withSpring(0); // Đóng nhanh
        // 💡 BỎ: Không cần đặt opacity ở đây nữa, useAnimatedReaction sẽ lo
        // opacity.value = withTiming(0);
      }
    })
    .onUpdate(event => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      } else {
        translateX.value = 0;
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        // Mở hẳn
        translateX.value = withSpring(SWIPE_WIDTH, {
          damping: 15,
          stiffness: 200,
        });
        if (onSwipe) {
          runOnJS(onSwipe)();
        }
        // 💡 BỎ: Không cần đặt opacity ở đây nữa, useAnimatedReaction sẽ lo
        // opacity.value = withTiming(1, {duration: 150}); // Đảm bảo hiển thị sau khi mở hẳn
      } else {
        // Đóng lại
        translateX.value = withSpring(0, {
          damping: 25,
          stiffness: 90,
        });
        // 💡 BỎ: Không cần đặt opacity ở đây nữa, useAnimatedReaction sẽ lo
        // opacity.value = withTiming(0, {duration: 300});
      }
    });

  const composedGesture = Gesture.Exclusive(panGesture, simultaneousGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const animatedActionsStyle = useAnimatedStyle(() => ({
    // Opacity được quản lý bởi useAnimatedReaction
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {renderRightActions && (
        <Animated.View style={[styles.actionsContainer, animatedActionsStyle]}>
          {renderRightActions()}
        </Animated.View>
      )}

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.swipeableItem, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  swipeableItem: {
    width: '100%',
    zIndex: 2,
  },
  actionsContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default ReanimatedSwipeable;
