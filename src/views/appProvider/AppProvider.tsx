import React, { ReactNode, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '../../elements/alert/AlertProvider';
import '../../languages/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../languages/i18n';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '../../constants';
import { s, vs } from 'react-native-size-matters';
import { PaperProvider } from 'react-native-paper';
import { navigationRef } from '../../navigation/RootNavigation';
import { setupFCM } from '../../../firebase/fcmService';
import NameScreen from '../../navigation/nameScreen/NameScreen';
import { useNameScreen } from '../../zustand/store/useNameScreen/useNameScreen';
import { MMKV } from 'react-native-mmkv';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
type Props = {
  children: ReactNode;
  onReady?: () => void;
};
const toastConfig = {
  error: (props: any) => <ErrorToast {...props} style={styles.styleError} />,
  success: (props: any) => <BaseToast {...props} style={styles.styleSuccess} />,
};

export const storage = new MMKV();
export default function AppProvider(props: Props) {
  const { setNameScreen } = useNameScreen();

  const statusBarConfig = () => {
    if (Platform.OS !== 'ios') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
  };

  const handleNavigationChange = (state: any) => {
    let currentRoute = state?.routes[state?.index];
    let currentRouteName = currentRoute?.name;

    // Kiểm tra nested navigator
    while (currentRoute?.state && currentRoute.state?.index != null) {
      currentRoute = currentRoute?.state?.routes[currentRoute?.state?.index];
      currentRouteName = currentRoute?.name;
    }

    setNameScreen(currentRouteName);
  };

  const [queryClient] = React.useState(() => new QueryClient());

  useEffect(() => {
    statusBarConfig();
    setupFCM();
  }, []);

  return (
    <SafeAreaProvider>
      <AlertProvider>
        <NavigationContainer onStateChange={handleNavigationChange} ref={navigationRef}>
          <GestureHandlerRootView style={styles.flex1}>
            <PaperProvider>
              <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
              </QueryClientProvider>
              {__DEV__ && <NameScreen />}
              <Toast config={toastConfig} />
            </PaperProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </AlertProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  styleSuccess: {
    marginTop: vs(20),
    width: SCREEN_WIDTH - s(32),
    borderLeftColor: '#69C779',
  },
  styleError: {
    width: SCREEN_WIDTH - s(32),
    borderLeftColor: '#FE6301',
    marginTop: vs(20),
  },
});
