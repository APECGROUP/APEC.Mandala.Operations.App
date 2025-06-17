import React from 'react';
import {AuthParams} from './params';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../screens/authScreen/ForgotPasswordScreen';
import LoginScreen from '../screens/authScreen/LoginScreen';
import NewPasswordScreen from '../screens/authScreen/NewPasswordScreen';
import OTPScreen from '../screens/authScreen/OTPScreen';
import RegisterScreen from '../screens/authScreen/RegisterScreen';
import {s} from 'react-native-size-matters';
import {getFontSize} from '../constants';
import light from '../theme/light';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModalPickHotel from '../views/modal/ModalPickHotel';
import IconBack from '../../assets/icon/IconBack';
import AppBlockButton from '../elements/button/AppBlockButton';
import {goBack} from './RootNavigation';
import {StyleSheet} from 'react-native';
import {Colors} from '@/theme/Config';

const {Navigator, Screen, Group} = createNativeStackNavigator<AuthParams>();
export const HeaderLeft = () => {
  return (
    <AppBlockButton onPress={goBack} style={styles.buttonBack}>
      <IconBack />
    </AppBlockButton>
  );
};
export const HeaderLeftWhite = () => {
  return (
    <AppBlockButton onPress={goBack} style={styles.buttonBack}>
      <IconBack color={Colors.WHITE} />
    </AppBlockButton>
  );
};
export default function AuthNavigator() {
  const {top} = useSafeAreaInsets();
  return (
    <Navigator
      screenOptions={{
        // animation: 'simple_push',
        headerShown: false,
        headerTransparent: false,
        headerBackButtonDisplayMode: 'minimal',
        headerLeft: HeaderLeft,
        headerTitleStyle: {
          fontSize: getFontSize(18),
          color: light.text,
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: {backgroundColor: '#fff', paddingHorizontal: s(16)},
        headerTitleAlign: 'center',
        // gestureEnabled: false,
        // presentation: 'fullScreenModal',
      }}
      initialRouteName={'LoginScreen'}>
      <Group>
        <Screen name="LoginScreen" component={LoginScreen} />
        <Screen
          name="RegisterScreen"
          options={({route}) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle:
              route.params?.type === 'forgotPassword'
                ? 'Tạo mật khẩu mới'
                : 'Đăng ký tài khoản',
          })}
          component={RegisterScreen}
        />
        <Screen
          name="OTPScreen"
          options={({route}) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle:
              route.params?.type === 'forgotPassword'
                ? 'Tạo mật khẩu mới'
                : 'Đăng ký tài khoản',
          })}
          component={OTPScreen}
        />

        <Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: '',
          }}
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Screen name="NewPasswordScreen" component={NewPasswordScreen} />
      </Group>

      <Group
        screenOptions={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: {backgroundColor: '#0000001A'},
        }}>
        <Screen name={'ModalPickHotel'} component={ModalPickHotel} />
      </Group>
    </Navigator>
  );
}

const styles = StyleSheet.create({
  buttonBack: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
