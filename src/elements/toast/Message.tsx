import { Colors } from '@/theme/Config';
import { PaddingHorizontal } from '@/utils/Constans';
import IconClose from '@assets/icon/IconClose';
import React, { useEffect, useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ms, s, vs } from 'react-native-size-matters';
import { AppText } from '../text/AppText';
import light from '@/theme/light';
import IconNotiError from '@assets/icon/IconNotiError';
import IconNotiSuccess from '@assets/icon/IconNotiSuccess';

// Import các module cần thiết từ react-native-reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  interpolate, // Thêm interpolate
} from 'react-native-reanimated';

export type MessageProps = {
  onHide?: () => any;
  message: string;
  type: string;
};

export enum TYPE_TOAST {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

const Message = ({ onHide, message, type }: MessageProps) => {
  // Sử dụng useSharedValue để tạo giá trị animation
  const animatedProgress = useSharedValue(0); // 0: ẩn, 1: hiện

  useEffect(() => {
    // Định nghĩa chuỗi animation
    animatedProgress.value = withSequence(
      withTiming(1, { duration: 500 }), // Hiện lên (opacity 0 -> 1) trong 500ms
      withDelay(
        2000, // Đợi 2 giây
        withTiming(0, { duration: 500 }, isFinished => {
          // Ẩn đi (opacity 1 -> 0) trong 500ms
          if (isFinished && onHide) {
            runOnJS(onHide)(); // Gọi onHide trên JS thread sau khi animation kết thúc
          }
        }),
      ),
    );
  }, [animatedProgress, onHide]);

  // Xác định màu nền của toast dựa trên loại (type)
  const toastBackgroundColor = useMemo(() => {
    switch (type) {
      case TYPE_TOAST.ERROR:
        return Colors.RED_900;
      case TYPE_TOAST.SUCCESS:
        return Colors.PRIMARY_500;
      case TYPE_TOAST.WARNING:
        return Colors.YELLOW_900;
      default:
        return Colors.PRIMARY_500; // Mặc định
    }
  }, [type]);
  const translateY = -vs(20);
  // Tạo animated styles sử dụng useAnimatedStyle
  const rToastStyle = useAnimatedStyle(() => ({
    opacity: animatedProgress.value, // Opacity theo giá trị animatedProgress
    transform: [
      {
        translateY: interpolate(animatedProgress.value, [0, 1], [translateY, 0]),
      },
    ],
    backgroundColor: toastBackgroundColor,
  }));

  // Render icon dựa trên loại (type)
  const renderIcon = useMemo(() => {
    switch (type) {
      case TYPE_TOAST.SUCCESS:
        return <IconNotiSuccess />;
      default:
        return <IconNotiError />;
    }
  }, [type]);

  return (
    <Animated.View style={[styles.container, rToastStyle]}>
      <View style={styles.viewLeft}>
        {renderIcon}
        <AppText style={styles.title}>{message}</AppText>
      </View>
      <TouchableOpacity
        style={{ padding: vs(12), paddingRight: PaddingHorizontal }}
        onPress={onHide}>
        <IconClose fill={light.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    margin: ms(10),
    marginBottom: vs(5),
    paddingLeft: PaddingHorizontal,
    borderRadius: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor sẽ được thiết lập bởi rToastStyle
    zIndex: 1000,
    // Thêm shadow để hiển thị tốt hơn
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    paddingVertical: vs(12),
    color: light.white,
    marginLeft: s(12),
  },
  viewLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
  },
});
