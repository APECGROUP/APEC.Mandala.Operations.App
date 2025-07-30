import { Linking, Platform } from 'react-native';
import { useEffect } from 'react';
import { useAlert } from '@/elements/alert/AlertProvider';
import VersionCheck from 'react-native-version-check';

const useCheckVersion = () => {
  const { showAlert } = useAlert();

  const checkVersion = async () => {
    try {
      const updateNeeded = await VersionCheck.needUpdate();

      if (updateNeeded?.isNeeded) {
        showAlert(
          'Có phiên bản mới',
          'Vui lòng cập nhật ứng dụng để có trải nghiệm tốt nhất',
          [
            {
              text: 'Cập nhật ngay',
              onPress: () => {
                Linking.openURL(
                  Platform.select({
                    ios: updateNeeded.storeUrl, // App Store
                    android: updateNeeded.storeUrl, // Google Play
                  }) || '',
                );
              },
            },
          ],
          undefined,
        );
      }
    } catch (error) {
      console.log('Error checking version:', error);
    }
  };
  useEffect(() => {
    checkVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCheckVersion;
