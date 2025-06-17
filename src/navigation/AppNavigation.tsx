import {useState, useEffect, useCallback} from 'react';
import {Animated, LogBox, StyleSheet, View} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {useIsLogin} from '../zustand/store/useIsLogin/useIsLogin';
import MainNavigator from './MainNavigator';
import {s, vs} from 'react-native-size-matters';
import DataLocal from '../data/DataLocal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppBlock} from '../elements/block/Block';
import AuthNavigator from './AuthNavigator';
import FastImage from 'react-native-fast-image';
import {AppText} from '@/elements/text/AppText';
// BootSplash.hide();
LogBox.ignoreAllLogs();
const AppNavigation = () => {
  const {isLogin} = useIsLogin();
  const [splashVisible, setSplashVisible] = useState(true);
  const opacity = useState(new Animated.Value(1))[0]; // Khởi tạo animation opacity
  const {bottom} = useSafeAreaInsets();
  const init = useCallback(async () => {
    await DataLocal.checkAuthStatus();
  }, []);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    init().finally(() => {
      timeoutId = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setSplashVisible(false);
          BootSplash.hide({fade: true});
        });
      }, 1000);
    });

    return () => clearTimeout(timeoutId);
  }, [init, opacity]);
  return (
    <AppBlock style={styles.flex}>
      <View style={[styles.flex]}>
        {/* <View style={[styles.flex, {paddingBottom: bottom || vs(5)}]}> */}
        {!isLogin ? <MainNavigator /> : <AuthNavigator />}
      </View>
      {splashVisible && (
        <Animated.View style={[styles.splashContainer, {opacity}]}>
          <FastImage
            source={require('../../assets/bootsplash/logo.png')}
            style={styles.logo}
          />
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
