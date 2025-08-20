// 🧾 Giải thích:
// - Quản lý token, user, trạng thái đăng nhập.
// - Tài khoản + mật khẩu được lưu bằng Keychain (bảo mật).
// - Token được lưu bằng MMKV (nhanh hơn).
// - User vẫn dùng storage vì không cần bảo mật cao.

// 📦 Package cần thiết:
// yarn add react-native-keychain

import * as Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';
import moment from 'moment';
// Import refreshTokenAPI từ file AuthService riêng biệt
import { refreshTokenAPI } from '../utils/AuthService';
import { useIsLogin } from '../zustand/store/useIsLogin/useIsLogin';
import { useInfoUser } from '../zustand/store/useInfoUser/useInfoUser';
import { Strings } from '../languages/FunctionLanguage';
import { storage } from '../views/appProvider/AppProvider';
import i18n from '../languages/i18n';
import { IDataListHotel } from '@/views/modal/modalPickHotel/modal/PickHotelModal';
import { fetchStatusGlobal, IResponseAPILogin, IUser } from '@/screens/authScreen/modal/AuthModal';

export const TOKEN_KEY = 'ACCESS_TOKEN';
export const USER_KEY = 'USER_INFO';
export const REMEMBER_KEY = 'REMEMBER_LOGIN';
export const LANGUAGE_KEY = 'CURRENT_LANGUAGE';
export const CREDENTIALS_KEY = 'USER_CREDENTIALS';

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Đây sẽ là timestamp (milliseconds)
  refreshExpiresAt: number; // Đây sẽ là timestamp (milliseconds)
};

export type CredentialsType = {
  username: string;
  password: string;
  hotel: IDataListHotel;
};

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

const DataLocal = {
  token: null as TokenType | null,
  user: null as IUser | null,
  credentials: null as CredentialsType | null,
  authStatus: 'loading' as AuthStatus,
  rememberLogin: false,
  currentLanguage: 'vi' as string, // Mặc định là tiếng Việt

  setAuthStatus: (status: AuthStatus) => {
    console.log('setAuthStatus', status);
    DataLocal.authStatus = status;
    useIsLogin.getState().setIsLogin(status === 'authenticated');
  },

  // ✅ Lưu thông tin đăng nhập (username + password + hotel) khi user chọn "Nhớ đăng nhập"
  saveLoginCredentials: async (
    username: string,
    password: string,
    hotel: IDataListHotel | undefined,
  ): Promise<void> => {
    await DataLocal.saveCredentials(username, password, hotel);
  },

  // ✅ Lưu tài khoản + mật khẩu + khách sạn vào Keychain
  saveCredentials: async (
    username: string,
    password: string,
    hotel: IDataListHotel | undefined,
  ): Promise<void> => {
    try {
      const credentials: CredentialsType = { username, password, hotel };
      DataLocal.credentials = credentials;
      await Keychain.setGenericPassword(CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu thông tin đăng nhập thất bại' });
    }
  },

  // ✅ Lấy tài khoản + mật khẩu từ Keychain
  getCredentials: async (): Promise<CredentialsType | null> => {
    if (DataLocal.credentials) {
      return DataLocal.credentials;
    }

    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const parsedCredentials: CredentialsType = JSON.parse(credentials.password);
        DataLocal.credentials = parsedCredentials;
        return parsedCredentials;
      }
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lấy thông tin đăng nhập thất bại' });
    }
    return null;
  },

  // ✅ Lưu token vào MMKV
  saveToken: async (
    accessToken: string,
    refreshToken: string,
    expiresAt: string, // Chuỗi ISO 8601 từ API
    refreshExpiresAt: string, // Chuỗi ISO 8601 từ API
  ): Promise<void> => {
    try {
      // Chuyển đổi chuỗi ISO 8601 sang timestamp (milliseconds từ epoch)
      const expiresAtTimestamp = moment(expiresAt).valueOf();
      const refreshExpiresAtTimestamp = moment(refreshExpiresAt).valueOf();

      const tokenData: TokenType = {
        accessToken,
        refreshToken,
        expiresAt: expiresAtTimestamp,
        refreshExpiresAt: refreshExpiresAtTimestamp,
      };

      DataLocal.token = tokenData;
      storage.set(TOKEN_KEY, JSON.stringify(tokenData));
      console.log('Token saved:', tokenData);
      DataLocal.setAuthStatus('authenticated');
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu token thất bại' });
    }
  },

  // ✅ Lấy token từ MMKV
  getToken: async (): Promise<TokenType | null> => {
    if (DataLocal.token) {
      return DataLocal.token;
    }

    try {
      const storedToken = storage.getString(TOKEN_KEY);
      if (storedToken) {
        const parsedToken: TokenType = JSON.parse(storedToken);
        const currentTime = moment().valueOf();

        if (currentTime < parsedToken.expiresAt) {
          DataLocal.token = parsedToken;
          console.log('Token retrieved and still valid:', parsedToken);
          DataLocal.setAuthStatus('authenticated');
          await fetchStatusGlobal();
          return parsedToken;
        } else if (currentTime < parsedToken.refreshExpiresAt) {
          // Chỉ gọi refreshAccessToken nếu refresh token vẫn còn hạn
          const newToken = await DataLocal.refreshAccessToken(parsedToken.refreshToken);
          if (newToken) {
            await fetchStatusGlobal();
            return newToken;
          }
        }

        // Nếu cả access và refresh token đều hết hạn hoặc refresh thất bại
        await DataLocal.removeAll();
        return null;
      }
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lấy token thất bại' });
    }
    console.log('No valid token found, setting status to unauthenticated.');
    DataLocal.setAuthStatus('unauthenticated');
    return null;
  },

  // ✅ Lưu user bằng storage
  saveUser: async (user: IUser): Promise<void> => {
    try {
      DataLocal.user = user;
      await useInfoUser.getState().saveInfoUser(user);
      await useInfoUser.getState().setDeviceToken(user.deviceToken);
      storage.set(USER_KEY, JSON.stringify(user));
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu thông tin người dùng thất bại' });
    }
  },

  getUser: async (): Promise<IUser | null> => {
    if (DataLocal.user) {
      return DataLocal.user;
    }

    try {
      const storedUser = storage.getString(USER_KEY);
      if (storedUser) {
        const parsedUser: IUser = JSON.parse(storedUser);
        DataLocal.user = parsedUser;
        await useInfoUser.getState().saveInfoUser(parsedUser);
        return parsedUser;
      }
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lấy thông tin người dùng thất bại' });
    }
    return null;
  },

  // ✅ Lưu ngôn ngữ hiện tại
  saveLanguage: async (language: string): Promise<void> => {
    try {
      DataLocal.currentLanguage = language;
      storage.set(LANGUAGE_KEY, language);

      // Cập nhật ngôn ngữ trong i18n
      await i18n.changeLanguage(language);

      Toast.show({
        type: 'success',
        text2: language === 'vi' ? 'Đã chuyển sang tiếng Việt' : 'Switched to English',
      });
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu ngôn ngữ thất bại' });
    }
  },

  // ✅ Lấy ngôn ngữ hiện tại
  getLanguage: (): string => DataLocal.currentLanguage,

  // ✅ Load ngôn ngữ từ storage
  loadLanguage: (): void => {
    try {
      const storedLanguage = storage.getString(LANGUAGE_KEY);
      if (storedLanguage) {
        DataLocal.currentLanguage = storedLanguage;
        // Cập nhật ngôn ngữ trong i18n
        i18n.changeLanguage(storedLanguage);
      } else {
        // Nếu chưa có ngôn ngữ được lưu, dùng ngôn ngữ mặc định
        DataLocal.currentLanguage = 'vi';
        i18n.changeLanguage('vi');
      }
    } catch (error) {
      // Nếu có lỗi, dùng ngôn ngữ mặc định
      DataLocal.currentLanguage = 'vi';
      i18n.changeLanguage('vi');
    }
  },

  // ✅ Xoá toàn bộ thông tin (Keychain + MMKV + storage)
  removeAll: async (): Promise<void> => {
    try {
      DataLocal.token = null;
      DataLocal.user = null;
      DataLocal.rememberLogin = false;
      DataLocal.credentials = null;

      // Xóa token từ MMKV
      storage.delete(TOKEN_KEY);

      // Xóa user từ storage
      storage.delete(USER_KEY);

      // Xóa credentials từ Keychain
      await Keychain.resetGenericPassword();

      await useInfoUser.getState().saveInfoUser({} as IUser);
      console.log('All data removed.');
      DataLocal.setAuthStatus('unauthenticated');
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: Strings('Đã có lỗi xảy ra, vui lòng khởi động lại ứng dụng'),
      });
    }
  },

  // ✅ Lưu token và user sau khi login thành công
  saveAll: async (
    res: IResponseAPILogin,
    hotelCode: string,
    hotelName: string,
    deviceToken: string,
  ): Promise<void> => {
    try {
      await DataLocal.saveUser({ ...res.data?.user, hotelCode, hotelName, deviceToken });
      // Truyền expiresAt và refreshExpiresAt trực tiếp dưới dạng chuỗi
      await DataLocal.saveToken(
        res.data.accessToken,
        res.data.refreshToken,
        res.data.expiresAt,
        res.data.refreshExpiresAt,
      );
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu dữ liệu thất bại' });
    }
  },

  // ✅ Gọi API để refresh access token khi hết hạn
  refreshAccessToken: async (refreshToken: string): Promise<TokenType | null> => {
    try {
      // refreshTokenAPI giờ trả về IRefreshTokenResponseData | null trực tiếp
      const response = await refreshTokenAPI(refreshToken);
      if (response) {
        // Kiểm tra trực tiếp response
        await DataLocal.saveToken(
          response.accessToken, // Sử dụng accessToken trực tiếp từ response
          response.refreshToken, // Sử dụng refreshToken trực tiếp từ response
          response.expiresAt, // Sử dụng expiresAt trực tiếp từ response
          response.refreshExpiresAt, // Sử dụng refreshExpiresAt trực tiếp từ response
        );
        // Cập nhật DataLocal.token sau khi saveToken thành công
        return DataLocal.token;
      }
    } catch (error) {
      console.error('refreshAccessToken error:', error); // Log lỗi để debug
      await DataLocal.removeAll(); // Đăng xuất nếu refresh token thất bại
    }
    return null;
  },

  // ✅ Check trạng thái đăng nhập khi mở app
  checkAuthStatus: async (): Promise<AuthStatus> => {
    DataLocal.setAuthStatus('loading');
    DataLocal.loadRememberLogin();
    DataLocal.loadLanguage(); // Load ngôn ngữ khi khởi động app

    if (DataLocal.rememberLogin) {
      await DataLocal.getUser();
      await DataLocal.getToken();
      await DataLocal.getCredentials(); // Load credentials nếu có
    } else {
      await DataLocal.removeAll();
    }

    return DataLocal.authStatus;
  },

  // ✅ Lưu trạng thái "Nhớ đăng nhập"
  setRememberLogin: (val: boolean): void => {
    DataLocal.rememberLogin = val;
    storage.set(REMEMBER_KEY, val ? 'true' : 'false');

    // Nếu tắt "Nhớ đăng nhập" thì xóa credentials
    if (!val) {
      DataLocal.credentials = null;
      Keychain.resetGenericPassword();
    }
  },

  // ✅ Load trạng thái nhớ đăng nhập
  loadRememberLogin: (): void => {
    const val = storage.getString(REMEMBER_KEY);
    DataLocal.rememberLogin = val === 'true';
    useIsLogin.getState().setIsRememberLogin(val === 'true');
  },
};

export default DataLocal;
