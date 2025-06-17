import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import CustomAlert from './CustomAlert';
import ToastContainer, {ToastAction} from '../toast/ToastContainer';

interface AlertContextType {
  showAlert: (
    title: string,
    content: string,
    buttons: AlertButton[],
    icon?: React.ReactNode,
    animatedProp?: React.ReactNode,
  ) => void;
  hideAlert: () => void;
  showToast: (message: string, type: string) => void;
}

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProviderProps {
  children: ReactNode;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
  hideAlert: () => {},
  showToast: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<AlertProviderProps> = ({children}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [alertButtons, setAlertButtons] = useState<AlertButton[]>([]);
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [animated, setAnimated] = useState<React.ReactNode>(null);
  const toastRef = useRef<ToastAction>(null);

  const showAlert = useCallback(
    (
      title: string,
      content: string,
      buttons: AlertButton[],
      iconTitleProp?: React.ReactNode,
      animatedProp?: React.ReactNode,
    ) => {
      setAlertTitle(title);
      setAlertContent(content);
      setAlertButtons(buttons);
      setIcon(iconTitleProp || null);
      setAnimated(animatedProp || null);
      setModalVisible(true);
    },
    [],
  );

  const hideAlert = () => setModalVisible(false);

  const showToast = useCallback((message: string, type: string) => {
    toastRef.current?.show(message, type);
  }, []);

  return (
    <AlertContext.Provider value={{showAlert, hideAlert, showToast}}>
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
        />
      )}
      <ToastContainer ref={toastRef} />
    </AlertContext.Provider>
  );
};
