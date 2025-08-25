import { Alert, Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import Toast from 'react-native-toast-message';
import { navigate } from '../src/navigation/RootNavigation';
import { AppState } from 'react-native';

import {
  getMessaging,
  getToken,
  requestPermission,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import Clipboard from '@react-native-clipboard/clipboard';
// Không cần import useInfoUser ở đây nữa vì đây là hàm tiện ích
// import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';

const messaging = getMessaging();

// Tạo channel notification cho Android
export const createDefaultNotificationChannel = async () => {
  try {
    await notifee.createChannel({
      id: 'default_channel_id_v2',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });
    console.log('[FCM] ✅ Notification channel created hoặc đã tồn tại');
  } catch (error) {
    console.log('[FCM] ❌ Tạo notiLfication channel thất bại:', error);
  }
};

// Xin quyền thông báo trên Android 13+
const requestAndroidNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version < 33) return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    return false;
  }
};

// Lấy FCM token và gửi lên server
// Hàm này bây giờ nhận setDeviceToken làm một tham số
export const getFCMTokenAndSendToServer = async (
  t: (key: string) => string,
  setDeviceToken: (token: string) => void, // <-- Thêm tham số này
) => {
  try {
    await registerDeviceForRemoteMessages(messaging);
    const permissionGranted = await requestAndroidNotificationPermission();

    if (!permissionGranted) {
      console.log('[FCM] ❌ Người dùng không cấp quyền thông báo');
      return;
    }

    const token = await getToken(messaging);

    console.log('[FCM] 🎯 FCM Device Token:', token);
    setDeviceToken(token); // <-- Gọi hàm được truyền từ bên ngoài
    // Clipboard.setString(token);

    // Gửi token lên server (tuỳ chọn bật lại)
    // const resp = await api.post('notifications/app-push/register', {
    //   pushToken: token,
    //   deviceName: await DeviceInfo.getDeviceName(),
    //   deviceInfo: DeviceInfo.getSystemVersion(),
    // });
    // if (resp.status !== 200 || resp.data.status !== 0) throw new Error('API error');
  } catch (error: any) {
    console.error('[FCM] ❌ Lỗi khi lấy token và gửi lên server:', error);
    Toast.show({
      type: 'error',
      text2: '[FCM] ❌ Lỗi khi lấy token và gửi lên server:',
    });
  }
};

// Cấu hình các sự kiện liên quan đến FCM
export const setupFCM = async () => {
  console.log('[FCM] 🔧 Bắt đầu setupFCM');

  await createDefaultNotificationChannel();

  const authStatus = await requestPermission(messaging);
  console.log('[FCM] 📲 Trạng thái quyền:', authStatus);

  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('[FCM] ❌ Không được cấp quyền thông báo');
    return;
  }
  console.log('[FCM] ✅ Đã được cấp quyền');

  // Lắng nghe khi app đang foreground
  onMessage(messaging, async remoteMessage => {
    console.log('[FCM] 🔔 Foreground message:', remoteMessage);
    await showLocalNotification(remoteMessage);
  });

  // Khi app đang background (Android)
  setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('[FCM] 💤 Background message:', remoteMessage);
    await showLocalNotification(remoteMessage);
  });

  // Lắng nghe sự kiện người dùng nhấn vào notification (cả foreground và background)
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('[FCM] 👆 Notification pressed foreground:', detail.notification);
      handleNotificationAction(detail);
    }
  });

  // Khi người dùng nhấn vào notification khi app ở background
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('[FCM] 🕹 Notification opened (background):', remoteMessage);
    handleNotificationAction(remoteMessage);
  });

  // Khi người dùng mở app từ trạng thái killed
  const initialNotification = await getInitialNotification(messaging);
  if (initialNotification) {
    console.log('[FCM] 🧊 Notification khi mở app lần đầu:', initialNotification);
    handleNotificationAction(initialNotification);
  } else {
    console.log('[FCM] ✅ Không có notification khi khởi động app');
  }
};

// Hiển thị thông báo cục bộ (local notification)

let currentAppState = AppState.currentState;

AppState.addEventListener('change', nextAppState => {
  currentAppState = nextAppState;
});

const showLocalNotification = async (remoteMessage: any) => {
  if (!remoteMessage || !remoteMessage.notification) return;

  // Chỉ hiển thị notification khi app đang foreground
  if (currentAppState === 'active') {
    try {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        ios: {
          sound: 'default',
        },
        android: {
          channelId: 'default_channel_id_v2',
          sound: 'default', // 🔊 Thêm dòng này để có âm thanh mặc định
          pressAction: { id: 'default' },
          importance: AndroidImportance.HIGH,
        },
        data: remoteMessage.data,
      });
    } catch (error) {
      console.log('[FCM] ❌ Không thể hiển thị local notification:', error);
    }
  } else {
    // App đang ở background hoặc killed, Firebase tự hiển thị notification rồi
    console.log('[FCM] App ở background hoặc killed, không hiển thị local notification.');
  }
};

// const showLocalNotification = async (remoteMessage: any) => {
//   if (!remoteMessage || !remoteMessage.notification) {
//     console.log('[FCM] ⚠️ Payload không có notification:', remoteMessage);
//     return;
//   }

//   console.log(
//     '[FCM] 📨 Hiển thị local notification:',
//     remoteMessage.notification,
//   );

//   try {
//     await notifee.displayNotification({
//       title: remoteMessage.notification.title,
//       body: remoteMessage.notification.body,
//       android: {
//         channelId: 'default_channel_id_v2',
//         pressAction: {id: 'default'},
//       },
//       data: remoteMessage.data,
//     });
//   } catch (error) {
//     console.log('[FCM] ❌ Không thể hiển thị local notification:', error);
//   }
// };

// Xử lý khi người dùng nhấn vào thông báo
const handleNotificationAction = (remoteMessage: any) => {
  console.log('Bấm vào thông báo đây');
  const screen = remoteMessage?.data?.screen;
  if (screen) {
    navigate(screen);
    Alert.alert('Chuyển hướng', remoteMessage?.notification?.body || '');
  } else {
    navigate('NotificationScreen');
    Alert.alert('Thông báo', remoteMessage?.notification?.body || '');
  }
};
