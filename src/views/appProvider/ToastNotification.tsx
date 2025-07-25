import { DeviceEventEmitter } from 'react-native';
import { useEffect } from 'react';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';

const ToastNotification = () => {
  const { showToast } = useAlert();
  useEffect(() => {
    DeviceEventEmitter.addListener('showToast', (message: { text: string; type: TYPE_TOAST }) => {
      // Handle showing toast notification
      showToast(message.text, message.type);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('showToast');
    };
  }, [showToast]);
  return null;
};

export default ToastNotification;
