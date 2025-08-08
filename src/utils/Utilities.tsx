import { t } from 'i18next';
import { Linking, Permission, PermissionsAndroid, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import { useStatusGlobal } from '@/zustand/store/useStatusGlobal/useStatusGlobal';

export default class Utilities {
  static isAndroid = () => Platform.OS === 'android';

  static normalizeVersion(version: string) {
    const parts = version.split('.');
    while (parts.length < 3) parts.push('0');
    return parts.join('.');
  }
  static async requestPermission(permission: Permission, alertHandler: any) {
    if (Platform.OS !== 'android') {
      return true;
    } // iOS tự động cấp quyền

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const granted = await PermissionsAndroid.request(permission);

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      alertHandler('Quyền bị từ chối', 'Bạn đã từ chối cấp quyền. Hãy vào Cài đặt để bật lại.', [
        { text: t('Hủy'), style: 'cancel', onPress: () => {} },
        { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
      ]);
    } else {
      Toast.show({
        type: 'error',
        text2: 'Người dùng từ chối quyền nhưng có thể hỏi lại sau.',
      });
    }

    return false;
  }

  static normalizeUri(uri: string) {
    return Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  }

  static removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD') // Tách dấu ra khỏi chữ
      .replace(/[\u0300-\u036f]/g, '') // Xoá các dấu
      .replace(/đ/g, 'd') // Chuyển đ -> d
      .replace(/Đ/g, 'D') // Chuyển Đ -> D
      .replace(/[^a-zA-Z0-9 ]/g, '') // Bỏ ký tự đặc biệt
      .replace(/\s+/g, ' ') // Replace multiple spaces with one
      .trim(); // Bỏ khoảng trắng đầu cuối
  }

  static async requestContactsPermission(alertHandler: any) {
    return await this.requestPermission(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, alertHandler);
  }

  static async requestCameraPermission(alertHandler: any) {
    return await this.requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA, alertHandler);
  }

  static async requestStoragePermission(alertHandler: any) {
    return await this.requestPermission(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      alertHandler,
    );
  }

  static async requestNotificationPermission(alertHandler: any) {
    if (Platform.OS !== 'android') {
      return true; // iOS tự động xử lý qua requestPermissions (PushNotification lib)
    }

    if (Platform.Version < 33) {
      return true; // Android dưới 13 không cần xin quyền
    }

    return await this.requestPermission(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      alertHandler,
    );
  }

  static processPickedImage = (image: any) => {
    if (!isAndroid) {
      image.filename = `${
        image.filename ? image.filename.split('.')[0] : new Date().getTime()
      }.jpg`;
    } else {
      const splitedPath = image.path.split('/');
      image.filename = splitedPath[splitedPath.length - 1]?.split('.')[0] + '.jpg';
    }
  };

  static showImagePicker = async ({
    params,
    isUsingCamera = false,
  }: {
    params?: any;
    isUsingCamera?: boolean;
  }) => {
    const defaultOptions = {
      width: 1000,
      height: 700,
      multiple: true,
      mediaType: 'photo',
      includeBase64: false,
      maxFiles: 100,
      forceJpg: true,
      writeTempFile: false,
      cropping: true,
      compressImage: true,
      compressImageQuality: 1,
      cropperChooseText: 'Xác nhận',
      cropperCancelText: 'Huỷ bỏ',
    };

    const imageOptions = {
      ...defaultOptions,
      ...params,
    };

    if (params?.compressImageMaxWidth) {
      imageOptions.compressImageMaxWidth = params.compressImageMaxWidth;
    }
    if (params?.compressImageMaxHeight) {
      imageOptions.compressImageMaxHeight = params.compressImageMaxHeight;
    }

    try {
      let images = null;
      if (!isUsingCamera) {
        images = await ImagePicker.openPicker(imageOptions!);
      } else {
        images = await ImagePicker.openCamera(imageOptions!);
      }
      if (isArray(images)) {
        map(images, image => {
          this.processPickedImage(image);
        });
      } else {
        this.processPickedImage(images);
      }
      return images;
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: 'Không thể lấy ảnh. Vui lòng thử lại.',
      });
      return Promise.reject(error);
    }
  };
  static showImageCrop = async ({ uri, params }: { uri: string; params?: any }) => {
    const defaultOptions = {
      path: uri,
      width: 300,
      height: 300,
      // cropping: true,
      // cropperToolbarTitle: 'Cắt ảnh',
      // cropperActiveWidgetColor: '#00ADEF',
      // cropperStatusBarColor: '#00ADEF',
      // cropperToolbarColor: '#ffffff',
      // cropperToolbarWidgetColor: '#000',
      // compressImageQuality: 1,
      // cropperCircleOverlay: false,
      // freeStyleCropEnabled: true,
    };

    const imageOptions = {
      ...defaultOptions,
      ...params,
    };

    try {
      let images = null;

      images = await ImagePicker.openCropper(imageOptions!);

      if (isArray(images)) {
        map(images, image => {
          this.processPickedImage(image);
        });
      } else {
        this.processPickedImage(images);
      }
      return images;
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: 'Không thể sửa ảnh. Vui lòng thử lại.',
      });
      return Promise.reject(error);
    }
  };

  static getStatusName(statusCode: string): string {
    try {
      // Truy cập Zustand trực tiếp
      const { getState } = useStatusGlobal;
      const { statusGlobal } = getState();

      return (
        statusGlobal.find(item => item.status.toUpperCase() === statusCode.toUpperCase())
          ?.statusName ?? 'Không rõ trạng thái'
      );
    } catch (error) {
      return 'Không rõ trạng thái';
    }
  }
}

export const isAndroid = () => Platform.OS === 'android';

export const numberFormat = (number: string | number, thousandSeparator = '.') => {
  if (Number(number) === 0) {
    return 0;
  }
  let numberString = number.toString();

  const prefix = numberString[0];
  let resPrefix = '';

  if (prefix === '+' || prefix === '-') {
    numberString = numberString.slice(1);
    resPrefix = prefix;
  }

  const rest = numberString.length % 3;
  let result = numberString.slice(0, rest);
  const thousands = numberString.slice(rest).match(/\d{3}/g);

  if (thousands) {
    const separator = rest ? thousandSeparator : '';
    result += separator + thousands.join(thousandSeparator);
  }
  return resPrefix + result;
};

export const moneyFormat = (number: string | number, thousandSeparator = '.', dot = ' VND') => {
  if (!number && number !== 0) {
    return '0 VND';
  }
  return numberFormat(number, thousandSeparator) + dot;
};
