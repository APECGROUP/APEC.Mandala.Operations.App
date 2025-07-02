// src/hook/useOtaUpdate.ts
import { Linking, Platform, LayoutAnimation } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import semver from 'semver';
import hotUpdate from 'react-native-ota-hot-update';
import { useCallback, useState } from 'react';
import { useAlert } from '../elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { IS_DEV } from '@/env';

const branch =
  Platform.OS === 'ios' ? (IS_DEV ? 'iOS-dev' : 'iOS') : IS_DEV ? 'android-dev' : 'android';

export const appVersion = DeviceInfo.getVersion();

// Hook kiểm tra và thực hiện OTA update qua Git
export const useOtaUpdate = () => {
  const { showAlert, showLoading, hideLoading } = useAlert();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // Trạng thái loading khi update
  const [progress, setProgress] = useState(0); // Tiến trình tải OTA

  // Hàm fetch có timeout để tránh treo app khi mạng kém
  const fetchWithTimeout = (url: string, options = {}, timeout = 30000): Promise<Response> =>
    Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error(t('update.timeout'))), timeout)),
    ]) as Promise<Response>;

  // Hàm kiểm tra và thực hiện update
  const checkForOtaUpdate = useCallback(async () => {
    try {
      setLoading(true);
      showLoading('Đang kiểm tra cập nhật...');
      console.log('[OTA] Bắt đầu kiểm tra cập nhật...');
      // Lấy version hiện tại của app
      console.log(`[OTA] Phiên bản app hiện tại: ${appVersion}`);

      // Lấy thông tin version mới nhất từ file version.json trên GitHub
      const res = await fetchWithTimeout(
        `https://raw.githubusercontent.com/tuanApec/Smart-Purchase-Ota/${branch}/version.json`,
        {},
        30000,
      );
      const data = await res.json();
      console.log('[OTA] Dữ liệu version.json:', data);

      // Lấy thông tin OTA cho từng nền tảng
      const info = Platform.OS === 'ios' ? data.ios : data.android;
      const minVersion = info.minVersion ?? '0.0.0';
      const maxVersion = info.maxVersion ?? '0.0.0';
      const otaVersion = info.otaVersion ?? '0.0.0';
      const bundlePath = info.bundlePath;
      console.log(
        `[OTA] minVersion: ${minVersion}, maxVersion: ${maxVersion}, otaVersion: ${otaVersion}, appVersion: ${appVersion}`,
      );

      // 1. Nếu appVersion < minVersion: bắt buộc lên store
      if (semver.lt(appVersion, minVersion)) {
        console.log(
          '[OTA] App version quá cũ, yêu cầu cập nhật trên store!',
          appVersion,
          minVersion,
        );
        hideLoading();
        const appStoreUrl = 'itms-apps://apps.apple.com/app/idYOUR_APP_ID'; // Thay YOUR_APP_ID
        const playStoreUrl = 'market://details?id=YOUR_PACKAGE_NAME'; // Thay YOUR_PACKAGE_NAME
        const storeUrl = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

        showAlert(t('update.updateObligatory'), t('update.updateObligatorySubtitle'), [
          {
            text: 'Để sau',
            onPress: () => {
              console.log('[OTA] User chọn để sau khi app quá cũ');
            },
            style: 'cancel',
          },
          {
            text: t('update.updateNow'),
            onPress: () => {
              console.log('[OTA] User chọn cập nhật ngay, mở store');
              Linking.openURL(storeUrl).catch(() => {
                // fallback nếu store URL lỗi → mở web
                const fallbackWebUrl =
                  Platform.OS === 'ios'
                    ? 'https://apps.apple.com/app/idYOUR_APP_ID'
                    : 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';
                console.log('[OTA] Store URL lỗi, mở fallback web:', fallbackWebUrl);
                Linking.openURL(fallbackWebUrl);
              });
            },
          },
        ]);
      }
      // 2. Nếu appVersion >= minVersion && appVersion <= maxVersion && appVersion < otaVersion: cho phép update OTA
      else if (
        semver.gte(appVersion, minVersion) &&
        semver.lte(appVersion, maxVersion) &&
        semver.lt(appVersion, otaVersion)
      ) {
        console.log(
          '[OTA] App đủ điều kiện update OTA:',
          appVersion,
          minVersion,
          maxVersion,
          otaVersion,
        );
        showLoading('Đang tải cập nhật...');
        hotUpdate.git.checkForGitUpdate({
          branch: branch,
          bundlePath,
          url: 'https://github.com/tuanApec/Smart-Purchase-Ota.git',

          onCloneFailed(msg: string) {
            console.log('[OTA] Clone repo thất bại:', msg);
            showAlert(t('update.title'), t('update.cloneFailed'), [
              { text: 'Hủy', onPress: () => {}, style: 'cancel' },
            ]);
          },

          onCloneSuccess() {
            console.log('[OTA] Clone repo thành công!');
            showAlert('Cập nhật thành công!', 'Khởi động lại để áp dụng thay đổi', [
              { text: 'Để sau', onPress: () => {}, style: 'cancel' },
              {
                text: 'Khởi động lại',
                onPress: () => {
                  console.log('[OTA] User chọn khởi động lại app');
                  hotUpdate.resetApp();
                },
              },
            ]);
          },

          onPullFailed(msg: string) {
            console.log('[OTA] Pull repo thất bại:', msg);
            hideLoading();
            showAlert('Cập nhật thất bại!', msg, [
              { text: 'Đóng', onPress: () => {}, style: 'cancel' },
            ]);
          },

          onPullSuccess() {
            console.log('[OTA] Pull repo thành công!');
            hideLoading();
            showAlert('Cập nhật thành công!', 'Khởi động lại để áp dụng thay đổi', [
              { text: 'Để sau', onPress: () => {}, style: 'cancel' },
              {
                text: 'Khởi động lại',
                onPress: () => {
                  console.log('[OTA] User chọn khởi động lại app');
                  hotUpdate.resetApp();
                },
              },
            ]);
          },

          onProgress(received: number, total: number) {
            const percent = Number(((received / total) * 100).toFixed(2));
            console.log(
              `[OTA] Đang tải bundle: ${received}/${total} (${percent}%)`,
              typeof percent,
            );
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setProgress(percent);
          },

          onFinishProgress() {
            console.log('[OTA] Hoàn thành tải bundle OTA!');
            setLoading(false);
            hideLoading();
          },
        });
      }
      // 3. Ngược lại: báo "chúc mừng, ứng dụng của bạn đã là phiên bản mới nhất"
      else {
        console.log(
          '[OTA] App đã là bản mới nhất, không cần cập nhật.',
          appVersion,
          minVersion,
          maxVersion,
          otaVersion,
        );
        hideLoading();
        showAlert(t('update.Congratulations'), t('update.CongratulationsSubtitle'), [
          {
            text: t('update.close'),
            onPress: () => {
              console.log('[OTA] User đóng thông báo không cần cập nhật');
            },
            style: 'cancel',
          },
        ]);
      }
    } catch (err: any) {
      console.log('[OTA] Lỗi kiểm tra/cập nhật:', err?.message || err);
      hideLoading();
      showAlert('Lỗi kiểm tra phiên bản!', err?.message || 'Không thể kết nối.', [
        {
          text: 'Đóng',
          onPress: () => {
            console.log('[OTA] User đóng alert lỗi');
          },
          style: 'cancel',
        },
      ]);
    } finally {
      setLoading(false);
      console.log('[OTA] Kết thúc kiểm tra/cập nhật OTA.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert, t]);

  return {
    loading, // Trạng thái loading
    progress, // Tiến trình tải OTA
    checkForOtaUpdate, // Hàm kiểm tra & cập nhật OTA
  };
};
