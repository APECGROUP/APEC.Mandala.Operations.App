import React, {useRef} from 'react';
import {
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
  TouchableOpacityProps,
} from 'react-native';

type DebounceTouchableProps = TouchableOpacityProps & {
  onPress?: (event: GestureResponderEvent) => void;
  onDoubleTap?: (event: GestureResponderEvent) => void;
  doubleTapDelay?: number; // Thời gian nhận diện double-tap
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const AppButtonDebounce: React.FC<DebounceTouchableProps> = ({
  onPress,
  onDoubleTap,
  doubleTapDelay = 300, // Mặc định thời gian nhận diện double-tap
  children,
  style,
  ...touchableProps // Nhận các props còn lại của TouchableOpacity
}) => {
  const lastTap = useRef<number | null>(null);
  const singleTapTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePress = (event: GestureResponderEvent) => {
    const now = Date.now();

    if (lastTap.current && now - lastTap.current < doubleTapDelay) {
      // Nếu phát hiện double-tap
      if (singleTapTimeout.current) {
        clearTimeout(singleTapTimeout.current); // Hủy xử lý single-tap
      }
      onDoubleTap?.(event); // Gọi callback double-tap
    } else {
      // Nếu không phải double-tap
      lastTap.current = now;
      singleTapTimeout.current = setTimeout(() => {
        onPress?.(event); // Gọi callback single-tap
      }, doubleTapDelay);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={style}
      {...touchableProps} // Truyền các props còn lại
    >
      {children}
    </TouchableOpacity>
  );
};

export default AppButtonDebounce;
