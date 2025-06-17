import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  I18nManager,
  StyleSheet,
  TouchableWithoutFeedbackProps,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import AppButtonDebounce from './AppButtonDebounce';

type RippleType = {
  unique: number;
  progress: Animated.Value;
  locationX: number;
  locationY: number;
  R: number;
};

type Props = {
  rippleColor?: string;
  rippleOpacity?: number;
  rippleDuration?: number;
  rippleSize?: number;
  rippleContainerBorderRadius?: number;
  rippleCentered?: boolean;
  rippleSequential?: boolean;
  rippleFades?: boolean;
  disabled?: boolean;
  debounceTime?: number; // Add debounceTime prop
  children: any;
  nativeID?: string;
  noRipple?: boolean;

  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
} & TouchableWithoutFeedbackProps;

let mounted = false;
let unique = 0;

function onRippleAnimation(
  animation: Animated.CompositeAnimation,
  callback: () => void,
) {
  animation.start(callback);
}

export default (props: Props) => {
  const {
    noRipple = false,
    rippleColor = 'rgb(255, 255, 255)',
    rippleOpacity = 0.3,
    rippleDuration = 400,
    rippleSize = 0,
    rippleContainerBorderRadius = 0,
    rippleCentered = false,
    rippleSequential = false,
    rippleFades = true,
    disabled = false,
    debounceTime = 500,
  } = props;

  if (noRipple) {
    return (
      <AppButtonDebounce
        disabled={disabled}
        doubleTapDelay={debounceTime}
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        delayLongPress={props.delayLongPress}
        style={props.style as any} // ép kiểu nếu cần
      >
        {props.children}
      </AppButtonDebounce>
    );
  }

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [ripples, setRipples] = useState<any[]>([]);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isDebouncing = useRef(false);

  useEffect(() => {
    mounted = true;
    return () => {
      mounted = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Clear timeout on unmount
      }
    };
  }, []);

  function onLayout(event: LayoutChangeEvent) {
    let {width: w, height: h} = event.nativeEvent.layout;
    setWidth(w);
    setHeight(h);
  }

  function handleDebounce(callback: () => void) {
    if (isDebouncing.current) return;

    // Trigger the callback
    callback();

    // Set debounce flag to true
    isDebouncing.current = true;

    // Reset debounce after the specified debounceTime
    debounceTimeout.current = setTimeout(() => {
      isDebouncing.current = false;
    }, debounceTime);
  }

  function onPress(event: any) {
    handleDebounce(() => {
      if (!rippleSequential || !ripples.length) {
        if (typeof props.onPress === 'function') {
          requestAnimationFrame(() => props.onPress && props.onPress(event));
        }
        event.persist();
        startRipple(event);
      }
    });
  }

  function onLongPress(event: any) {
    handleDebounce(() => {
      if (typeof props.onLongPress === 'function') {
        requestAnimationFrame(
          () => props.onLongPress && props.onLongPress(event),
        );
      }
      event.persist();
      startRipple(event);
    });
  }

  function onPressIn(event: any) {
    if (typeof props.onPressIn === 'function') {
      event.persist();
      props.onPressIn(event);
    }
  }

  function onPressOut(event: any) {
    if (typeof props.onPressOut === 'function') {
      event.persist();
      props.onPressOut(event);
    }
  }

  function onAnimationEnd() {
    if (mounted) {
      const tmp = ripples.slice(1);
      setRipples(tmp);
    }
  }

  function startRipple(event: any) {
    let w2 = 0.5 * width;
    let h2 = 0.5 * height;

    let {locationX, locationY} = rippleCentered
      ? {locationX: w2, locationY: h2}
      : event.nativeEvent;

    let offsetX = Math.abs(w2 - locationX);
    let offsetY = Math.abs(h2 - locationY);

    let R =
      rippleSize > 0
        ? 0.5 * rippleSize
        : Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2));

    let ripple = {
      unique: unique++,
      progress: new Animated.Value(0),
      locationX,
      locationY,
      R,
    };

    let animation = Animated.timing(ripple.progress, {
      toValue: 1,
      easing: Easing.out(Easing.ease),
      duration: rippleDuration,
      useNativeDriver: true,
    });

    onRippleAnimation(animation, onAnimationEnd);

    const tmp = ripples.concat(ripple);
    setRipples(tmp);
  }

  function renderRipple({
    unique: key,
    progress,
    locationX,
    locationY,
    R,
  }: RippleType) {
    let rippleStyle = {
      top: locationY - radius,
      [I18nManager.isRTL ? 'right' : 'left']: locationX - radius,
      backgroundColor: rippleColor,

      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5 / radius, R / radius],
          }),
        },
      ],

      opacity: rippleFades
        ? progress.interpolate({
            inputRange: [0, 1],
            outputRange: [rippleOpacity, 0],
          })
        : rippleOpacity,
    };

    return <Animated.View style={[styles.ripple, rippleStyle]} key={key} />;
  }

  let {
    delayLongPress,
    delayPressIn,
    delayPressOut,
    hitSlop,
    pressRetentionOffset,
    children,
    testID,
    nativeID,
    accessible,
    accessibilityHint,
    accessibilityLabel,
  } = props;

  let touchableProps = {
    delayLongPress,
    delayPressIn,
    delayPressOut,
    disabled,
    hitSlop,
    pressRetentionOffset,
    testID,
    accessible,
    accessibilityHint,
    accessibilityLabel,
    onLayout,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress: props.onLongPress ? onLongPress : undefined,
    ...(Platform.OS !== 'web' ? {nativeID} : null),
  };

  let containerStyle = {
    borderRadius: rippleContainerBorderRadius,
  };

  return (
    <TouchableWithoutFeedback {...touchableProps}>
      <Animated.View
        onLayout={onLayout}
        style={props.style}
        pointerEvents="box-only">
        {children}
        <View style={[styles.container, containerStyle]}>
          {ripples.map(renderRipple)}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const radius = 10;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  ripple: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    overflow: 'hidden',
    position: 'absolute',
  },
});
