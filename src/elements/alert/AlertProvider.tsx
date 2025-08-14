import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import CustomAlert from './CustomAlert';
import ToastContainer, { ToastAction } from '../toast/ToastContainer';
import { Colors } from '@/theme/Config';

interface AlertContextType {
  showAlert: (
    title: string,
    content: string,
    buttons: AlertButton[],
    icon?: React.ReactNode,
    animatedProp?: React.ReactNode,
    cancelButton?: boolean,
  ) => void;
  hideAlert: () => void;
  showToast: (message: string, type: string, positionDown?: boolean) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel';
}

interface AlertProviderProps {
  children: ReactNode;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
  hideAlert: () => {},
  showToast: () => {},
  showLoading: () => {},
  hideLoading: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<AlertProviderProps> = React.memo(({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [alertButtons, setAlertButtons] = useState<AlertButton[]>([]);
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [animated, setAnimated] = useState<React.ReactNode>(null);
  const [cancelButton, setCancelButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastAction>(null);

  // Memoized functions để tránh re-render
  const showAlert = useCallback(
    (
      title: string,
      content: string,
      buttons: AlertButton[],
      iconTitleProp?: React.ReactNode,
      animatedProp?: React.ReactNode,
      cancelButtonProp?: boolean,
    ) => {
      setAlertTitle(title);
      setAlertContent(content);
      setAlertButtons(buttons);
      setIcon(iconTitleProp || null);
      setAnimated(animatedProp || null);
      setCancelButton(cancelButtonProp || false);
      setModalVisible(true);
    },
    [],
  );

  const hideAlert = useCallback(() => setModalVisible(false), []);

  const showToast = useCallback((message: string, type: string, positionDown?: boolean) => {
    toastRef.current?.show(message, type, positionDown);
  }, []);

  const showLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  // Memoized context value để tránh re-render children
  const contextValue = useMemo(
    () => ({
      showAlert,
      hideAlert,
      showToast,
      showLoading,
      hideLoading,
    }),
    [showAlert, hideAlert, showToast, showLoading, hideLoading],
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {modalVisible && (
        <CustomAlert
          icon={icon}
          animated={animated}
          visible={modalVisible}
          title={alertTitle}
          content={alertContent}
          buttons={alertButtons}
          onClose={hideAlert}
          cancelButton={cancelButton}
        />
      )}
      <ToastContainer ref={toastRef} />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loading} />
        </View>
      )}
    </AlertContext.Provider>
  );
});

AlertProvider.displayName = 'AlertProvider';

const styles = StyleSheet.create({
  loading: {
    alignSelf: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0000001A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: s(16),
    padding: s(24),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: s(120),
    minHeight: s(120),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: vs(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: s(8),
    elevation: 8,
  },
  loadingMessageContainer: {
    marginTop: vs(12),
    alignItems: 'center',
    paddingHorizontal: s(8),
  },
  loadingMessage: {
    fontSize: ms(14),
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});
