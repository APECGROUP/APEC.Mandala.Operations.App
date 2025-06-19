import {Colors} from '@/theme/Config';
import {PaddingHorizontal} from '@/utils/Constans';
import IconClose from '@assets/icon/IconClose';
import React, {useEffect, useMemo, useRef} from 'react';

import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ms, s, vs} from 'react-native-size-matters';
import {AppText} from '../text/AppText';
import light from '@/theme/light';
import IconNotiError from '@assets/icon/IconNotiError';
import IconNotiSuccess from '@assets/icon/IconNotiSuccess';

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
const Message = ({onHide, message, type}: MessageProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  }, [onHide, opacity]);

  const toastBackground = () => {
    let color = Colors.PRIMARY_500;
    switch (type) {
      case TYPE_TOAST.ERROR:
        color = Colors.RED_900;
        break;
      case TYPE_TOAST.SUCCESS:
        color = Colors.PRIMARY_500;
        break;
      case TYPE_TOAST.WARNING:
        color = Colors.YELLOW_900;
        break;
      default:
        break;
    }
    return color;
  };

  const stylesView = () => ({
      opacity,
      transform: [
        {
          translateY: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0],
          }),
        },
      ],
      backgroundColor: toastBackground(),
    });

  const renderIcon = useMemo(() => {
    switch (type) {
      case TYPE_TOAST.SUCCESS:
        return <IconNotiSuccess />;

      default:
        return <IconNotiError />;
    }
  }, [type]);

  return (
    <Animated.View style={[styles.container, stylesView()]}>
      <View style={styles.viewLeft}>
        {renderIcon}
        <AppText style={styles.title}>{message}</AppText>
      </View>
      <TouchableOpacity
        style={{padding: vs(12), paddingRight: PaddingHorizontal}}
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

    // paddingVertical: vs(12),
    borderRadius: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    zIndex: 1000,
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
