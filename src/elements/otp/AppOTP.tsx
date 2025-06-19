/* eslint-disable react-hooks/exhaustive-deps */
import React, { RefObject, createContext, useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { IOtpContext, IOtpInput } from './Type';
import { s, vs } from 'react-native-size-matters';
import { getFontSize } from '../../constants';
import light from '../../theme/light';

const { width } = Dimensions.get('window');

const OtpContext = createContext<IOtpContext>({} as IOtpContext);

const OtpItem = ({ i }: { i: number }) => {
  const {
    inputRef,
    onPress,
    otpValue,
    onFocusNext,
    onFocusPrevious,
    setFocus,
    setOtpValue,
    focus,
    focusColor,
    containerStyle,
    inputStyle,
    textStyle,
    otpCount,
    editable,
    enteringAnimated,
    exitingAnimated,
    rest,
  } = useContext(OtpContext);

  const border = useSharedValue(focus === i ? 1.5 : 0);

  const borderStyle = useAnimatedStyle(
    () => ({
      borderWidth: border.value,
    }),
    [focus],
  );

  useEffect(() => {
    border.value = withDelay(50, withTiming(focus === i ? 1.5 : 0, { duration: 100 }));
  }, [focus]);

  useEffect(() => {
    if (otpValue) {
      if ((otpValue[i]?.length ?? 0) > 1) {
        const format = otpValue[i]?.substring(0, otpCount);
        const numbers = format?.split('') ?? [];
        setOtpValue(numbers);
        setFocus(-1);
        Keyboard.dismiss();
      }
    }
  }, [otpValue]);

  return (
    <View key={i} style={[containerStyle]}>
      <TextInput
        style={[styles.inputSize, inputStyle]}
        caretHidden
        keyboardType="number-pad"
        ref={inputRef.current[i]}
        value={otpValue[i]}
        onChangeText={v => onFocusNext(v, i)}
        onKeyPress={e => onFocusPrevious(e.nativeEvent.key, i)}
        textContentType="oneTimeCode"
        autoFocus={false}
        {...rest}
      />
      <Pressable disabled={!editable} onPress={onPress} style={styles.overlay}>
        <Animated.View
          style={[
            {
              borderColor: focusColor,
            },
            styles.inputSize,
            styles.input,
            borderStyle,
            inputStyle,
          ]}>
          {otpValue[i] !== '' && (
            <Animated.Text
              entering={enteringAnimated}
              exiting={exitingAnimated}
              style={[styles.text, textStyle]}>
              {otpValue[i]}
            </Animated.Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

export const AppOTP = ({
  label,
  errorMessage,
  otpCount = 6,
  containerStyle = {},
  inputStyle = {},
  textStyle = {},
  focusColor = '#4497ce',
  autoFocus = false,
  editable = true,
  enteringAnimated = FadeInDown,
  exitingAnimated = FadeOut,
  onCodeFilled,
  onCodeChanged,
  ...rest
}: IOtpInput) => {
  const inputRef = useRef<Array<RefObject<TextInput | null>>>([]);
  const data: string[] = new Array(otpCount).fill('');
  // inputRef.current = data.map(
  //   (_, index) => (inputRef.current[index] = React.createRef<TextInput>()),
  // );

  if (inputRef.current.length === 0) {
    inputRef.current = Array.from({ length: otpCount }, () => React.createRef<TextInput>());
  }
  const [focus, setFocus] = useState<number>(0);
  const [otpValue, setOtpValue] = useState<string[]>(data);

  const onPress = () => {
    if (focus === -1) {
      setFocus(otpCount - 1);
      otpValue[data.length - 1] = '';
      setOtpValue([...otpValue]);
      inputRef.current[data.length - 1].current?.focus();
    } else {
      inputRef.current[focus].current?.focus();
    }
  };

  const onFocusNext = (value: string, index: number) => {
    if (index < data.length - 1 && value) {
      inputRef.current[index + 1].current?.focus();
      setFocus(index + 1);
    }
    if (index === data.length - 1) {
      setFocus(-1);
      inputRef.current[index].current?.blur();
    }
    otpValue[index] = value;
    setOtpValue([...otpValue]);
  };

  const onFocusPrevious = (key: string, index: number) => {
    if (key === 'Backspace' && index !== 0) {
      inputRef.current[index - 1].current?.focus();
      setFocus(index - 1);
      otpValue[index - 1] = '';
      setOtpValue([...otpValue]);
    } else if (key === 'Backspace' && index === 0) {
      otpValue[0] = '';
    }
  };
  if (otpCount < 4 || otpCount > 6) {
    throw 'OTP Count min is 4 and max is 6';
  }
  const inputProps = {
    inputRef,
    otpValue,
    onPress,
    onFocusNext,
    onFocusPrevious,
    setFocus,
    setOtpValue,
    focus,
    autoFocus,
    containerStyle,
    inputStyle,
    textStyle,
    focusColor,
    otpCount,
    editable,
    enteringAnimated,
    exitingAnimated,
    rest,
  };

  // useEffect(() => {
  //   onCodeChanged && onCodeChanged(otpValue.join(''));
  //   if (
  //     otpValue &&
  //     Number(otpValue.join('').length === otpCount) &&
  //     onCodeFilled
  //   ) {
  //     onCodeFilled(otpValue.join(''));
  //   }
  // }, [otpValue]);

  useEffect(() => {
    if (!otpValue) return;

    const otpString = otpValue.join('');

    if (onCodeChanged) {
      onCodeChanged(otpString);
    }

    if (otpString.length === otpCount && onCodeFilled) {
      onCodeFilled(otpString);
    }
  }, [otpValue, onCodeChanged, onCodeFilled, otpCount]);

  useEffect(() => {
    if (autoFocus) {
      const timeout = setTimeout(() => {
        inputRef.current[0]?.current?.focus();
      }, 300); // delay để tránh đụng race với mount view

      return () => clearTimeout(timeout);
    }
  }, [autoFocus]);

  return (
    <OtpContext.Provider value={inputProps as IOtpContext}>
      {label && (
        <Text
          style={{
            fontSize: getFontSize(16),
            color: light.black,
            marginLeft: s(8),
            marginBottom: vs(8),
          }}>
          {label}
        </Text>
      )}
      <View style={[styles.rowCenter, styles.container]}>
        {data.map((_, i) => (
          <OtpItem key={i} i={i} />
        ))}
      </View>
      {errorMessage && (
        <Text
          style={{
            fontSize: getFontSize(12),
            color: light.danger,
            marginLeft: s(8),
            marginTop: vs(8),
          }}>
          {errorMessage}
        </Text>
      )}
    </OtpContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    // height: vs(100
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputSize: {
    height: vs(50),
    width: s(40),
    marginHorizontal: s(8),
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowOpacity: 0.09,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontWeight: '600',
    fontSize: getFontSize(26),
    color: '#2b4156',
  },
  overlay: {
    position: 'absolute',
  },
});

export default AppOTP;
