import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { useIsLogin } from '../zustand/store/useIsLogin/useIsLogin';
import MainNavigator from './MainNavigator';
import { s } from 'react-native-size-matters';
import DataLocal from '../data/DataLocal';
import { AppBlock } from '../elements/block/Block';
import AuthNavigator from './AuthNavigator';
import FastImage from 'react-native-fast-image';
BootSplash.hide();
// Import các module cần thiết từ react-native-reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import useCheckVersion from '@/hook/useCheckVersion';

// BootSplash.hide(); // Commented out as it's handled within the animation
// LogBox.ignoreAllLogs(); // If you need to ignore logs, keep this uncommented

const AppNavigation = () => {
  const { isLogin } = useIsLogin();
  useCheckVersion();
  const [splashVisible, setSplashVisible] = useState(true);
  // Sử dụng useSharedValue thay cho Animated.Value để kiểm soát opacity
  const animatedOpacity = useSharedValue(1); // 1: hiện, 0: ẩn

  const init = useCallback(async () => {
    // Thực hiện logic kiểm tra trạng thái đăng nhập
    await DataLocal.checkAuthStatus();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    init().finally(() => {
      // Delay 1 giây trước khi bắt đầu animation ẩn splash
      timeoutId = setTimeout(() => {
        // Sử dụng withTiming để tạo animation
        animatedOpacity.value = withTiming(0, { duration: 800 }, isFinished => {
          if (isFinished) {
            // Khi animation hoàn tất, chạy các hàm trên JS thread
            runOnJS(setSplashVisible)(false);
            runOnJS(BootSplash.hide)({ fade: true });
          }
        });
      }, 1000); // 1 giây delay
    });

    // Cleanup timeout khi component unmount
    return () => clearTimeout(timeoutId);
  }, [init, animatedOpacity]);

  // Tạo animated style cho splash screen
  const rSplashStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
  }));

  return (
    <AppBlock style={styles.flex}>
      <View style={[styles.flex]}>
        {/* Render MainNavigator nếu đã đăng nhập, ngược lại là AuthNavigator */}
        {isLogin ? <MainNavigator /> : <AuthNavigator />}
      </View>
      {/* Hiển thị splash screen chỉ khi splashVisible là true */}
      {splashVisible && (
        <Animated.View style={[styles.splashContainer, rSplashStyle]}>
          <FastImage source={require('../../assets/bootsplash/logo.png')} style={styles.logo} />
        </Animated.View>
      )}
    </AppBlock>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: s(80),
    height: s(80),
  },
});

export default AppNavigation;
