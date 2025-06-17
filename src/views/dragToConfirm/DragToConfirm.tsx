import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {s} from 'react-native-size-matters';

const {width: windowWidth} = Dimensions.get('window');

const BUTTON_WIDTH = s(windowWidth - 32);
const BUTTON_HEIGHT = s(56);
const BUTTON_PADDING = s(6);
const HANDLE_SIZE = BUTTON_HEIGHT - BUTTON_PADDING * 2;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_PADDING * 2 - HANDLE_SIZE;

interface Props {
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function DragToConfirm({onConfirm, onCancel}: Props) {
  const X = useSharedValue(0);
  const pressed = useSharedValue(false);
  const [toggled, setToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetButton = () => {
    setTimeout(() => {
      X.value = withSpring(0);
      pressed.value = false;
      setToggled(false);
      setIsLoading(false);
    }, 500);
  };

  const handleComplete = (isToggled: boolean) => {
    if (isToggled && !toggled) {
      setToggled(true);
      setIsLoading(true);
      onConfirm();
      runOnJS(resetButton)();
    } else {
      setToggled(false);
    }
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      pressed.value = toggled;
    })
    .onUpdate(e => {
      let newValue = pressed.value
        ? SWIPE_RANGE + e.translationX
        : e.translationX;
      newValue = Math.max(0, Math.min(newValue, SWIPE_RANGE));
      X.value = newValue;
    })
    .onEnd(() => {
      if (X.value > SWIPE_RANGE * 0.35) {
        X.value = withSpring(SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      } else {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      }
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{translateX: X.value}],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      X.value,
      [0, SWIPE_RANGE * 0.3],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const arrows = ['›', '›', '›', '›'];

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.labelWrapper, labelStyle]}>
          <Text style={styles.labelText}>Duyệt đơn</Text>
        </Animated.View>

        <View style={styles.arrowRow}>
          {arrows.map((arrow, i) => (
            <Text key={i} style={[styles.arrow, {opacity: 0.2 + i * 0.2}]}>
              {arrow}
            </Text>
          ))}
        </View>

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.handle, handleStyle]}>
            {!isLoading ? (
              <Text style={styles.handleIcon}>→</Text>
            ) : (
              <ActivityIndicator size="small" color="#2f7033" />
            )}
          </Animated.View>
        </GestureDetector>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <View style={styles.cancelInner}>
          <Text style={styles.cancelText}>×</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: s(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
  },
  wrapper: {
    flex: 1,
    height: BUTTON_HEIGHT,
    backgroundColor: '#227233',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  labelWrapper: {
    marginLeft: HANDLE_SIZE + s(8),
  },
  labelText: {
    color: '#fff',
    fontSize: s(16),
    fontWeight: '600',
  },
  arrowRow: {
    flexDirection: 'row',
    position: 'absolute',
    right: s(20),
  },
  arrow: {
    color: '#fff',
    fontSize: s(16),
    marginHorizontal: s(2),
  },
  handle: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: HANDLE_SIZE,
    width: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  handleIcon: {
    fontSize: s(20),
    color: '#227233',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginLeft: s(10),
  },
  cancelInner: {
    backgroundColor: '#DA3A2C',
    borderRadius: 999,
    width: s(48),
    height: s(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: s(4),
    borderColor: '#F8D7D5',
  },
  cancelText: {
    color: '#fff',
    fontSize: s(26),
    fontWeight: '600',
    marginTop: -s(2),
  },
});
