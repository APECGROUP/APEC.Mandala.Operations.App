import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextInput, TouchableOpacity, AppStateStatus, AppState, StyleSheet } from 'react-native';
import { getFontSize } from '../../../constants';
import moment from 'moment';
import light from '../../../theme/light';
import { AppText } from '../../../elements/text/AppText';

const COUNTDOWN_TIME = 60000; // 5 giây

const ButtonResend = ({ onPress }: { onPress: () => void }) => {
  const refText = useRef<TextInput | null>(null);
  const isCountingDown = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const endTime = useRef<number>(0);

  // Cập nhật countdown
  const updateCountdown = useCallback(() => {
    if (!isCountingDown.current) return;

    const now = Date.now();
    const remainingSeconds = Math.max(0, Math.floor((endTime.current - now) / 1000));

    if (refText.current) {
      refText.current.setNativeProps({ text: `${remainingSeconds}s` });
    }

    if (remainingSeconds <= 0) {
      setIsDisabled(false);
      isCountingDown.current = false;
      return;
    }

    animationFrameId.current = requestAnimationFrame(updateCountdown);
  }, []);

  // Hàm xử lý khi bấm gửi lại OTP
  const onResend = () => {
    onPress();
    setIsDisabled(true);
    endTime.current = Date.now() + COUNTDOWN_TIME;
    isCountingDown.current = true;
    updateCountdown();
  };

  // Khi component mount, kiểm tra và cập nhật countdown nếu còn thời gian
  useEffect(() => {
    const lastTime = moment().valueOf();
    const currentTime = Date.now();

    if (currentTime - lastTime >= COUNTDOWN_TIME) {
      setIsDisabled(false);
      return;
    }

    endTime.current = lastTime + COUNTDOWN_TIME;
    isCountingDown.current = true;
    updateCountdown();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cập nhật khi app trở lại foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateCountdown();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [updateCountdown]);

  return (
    <TouchableOpacity style={styles.row} disabled={isDisabled} activeOpacity={0} onPress={onResend}>
      <AppText style={[isDisabled ? styles.textDisable : styles.text]}>Gửi lại OTP</AppText>
      <AppText style={styles.textDefault}> (</AppText>
      <TextInput style={styles.textDefault} ref={refText} defaultValue="60s" editable={false} />
      <AppText style={styles.textDefault}>)</AppText>
    </TouchableOpacity>
  );
};

export default ButtonResend;

const styles = StyleSheet.create({
  textDefault: {
    fontSize: getFontSize(15),
    color: light.black,
  },
  textDisable: {
    fontSize: getFontSize(15),
    color: light.icon,
  },
  text: {
    fontSize: getFontSize(15),
    color: light.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
