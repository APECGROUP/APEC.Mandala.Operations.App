import React from 'react';
import { AuthParams } from './params';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../screens/authScreen/ForgotPasswordScreen';
import LoginScreen from '../screens/authScreen/LoginScreen';
import { s } from 'react-native-size-matters';
import { getFontSize } from '../constants';
import light from '../theme/light';
import ModalPickHotel from '../views/modal/modalPickHotel/view/ModalPickHotel';
import IconBack from '../../assets/icon/IconBack';
import AppBlockButton from '../elements/button/AppBlockButton';
import { goBack } from './RootNavigation';
import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/Config';
import ChangePasswordScreen from '@/screens/changePasswordScreen/ChangePasswordScreen';
import { isAndroid } from '@/utils/Utilities';

const { Navigator, Screen, Group } = createNativeStackNavigator<AuthParams>();
export const HeaderLeft = () => (
  <AppBlockButton onPress={goBack} style={styles.buttonBack}>
    <IconBack />
  </AppBlockButton>
);
export const HeaderLeftWhite = () => (
  <AppBlockButton onPress={goBack} style={styles.buttonBack}>
    <IconBack color={Colors.WHITE} />
  </AppBlockButton>
);
export default function AuthNavigator() {
  return (
    <Navigator
      screenOptions={{
        // animation: 'simple_push',

        headerShown: false,
        headerTransparent: false,
        headerBackButtonDisplayMode: 'minimal',
        headerLeft: HeaderLeft,
        headerTitleStyle: {
          fontSize: isAndroid() ? 18 : getFontSize(18),
          color: light.text,
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#fff', paddingHorizontal: s(16) },
        headerTitleAlign: 'center',
        // gestureEnabled: false,
        // presentation: 'fullScreenModal',
      }}
      initialRouteName={'LoginScreen'}>
      <Group>
        <Screen name="LoginScreen" component={LoginScreen} />

        <Screen
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: '',
          }}
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />

        <Screen
          options={{
            headerShown: true,
            headerTitle: '',
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name={'ChangePasswordScreen'}
          component={ChangePasswordScreen}
        />
      </Group>

      <Group
        screenOptions={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: '#0000001A' },
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
