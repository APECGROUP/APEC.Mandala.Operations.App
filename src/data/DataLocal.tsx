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
import { refreshTokenAPI } from '../utils/AuthService';
import { ResponseAPILogin, TypeUser } from '../interface/Authen.interface';
import { useIsLogin } from '../zustand/store/useIsLogin/useIsLogin';
import { useInfoUser } from '../zustand/store/useInfoUser/useInfoUser';
import { Strings } from '../languages/FunctionLanguage';
import { storage } from '../views/appProvider/AppProvider';
import i18n from '../languages/i18n';
import { IDataListHotel } from '@/views/modal/modalPickHotel/modal/PickHotelModal';

export const TOKEN_KEY = 'ACCESS_TOKEN';
export const USER_KEY = 'USER_INFO';
export const REMEMBER_KEY = 'REMEMBER_LOGIN';
export const LANGUAGE_KEY = 'CURRENT_LANGUAGE';
export const CREDENTIALS_KEY = 'USER_CREDENTIALS';

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
};

export type CredentialsType = {
  username: string;
  password: string;
  hotel: IDataListHotel;
};

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

const DataLocal = {
  token: null as TokenType | null,
  user: null as TypeUser | null,
  credentials: null as CredentialsType | null,
  authStatus: 'loading' as AuthStatus,
  rememberLogin: false,
  currentLanguage: 'vi' as string, // Mặc định là tiếng Việt

  setAuthStatus: (status: AuthStatus) => {
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
    expiresIn: number,
    refreshExpiresIn: number,
  ): Promise<void> => {
    try {
      const currentTime = moment().valueOf();
      const tokenData: TokenType = {
        accessToken,
        refreshToken,
        expiresAt: currentTime + expiresIn * 1000,
        refreshExpiresAt: currentTime + refreshExpiresIn * 1000,
      };

      DataLocal.token = tokenData;
      storage.set(TOKEN_KEY, JSON.stringify(tokenData));

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
          DataLocal.setAuthStatus('authenticated');
          return parsedToken;
        } else if (currentTime < parsedToken.refreshExpiresAt) {
          const newToken = await DataLocal.refreshAccessToken(parsedToken.refreshToken);
          if (newToken) {
            return newToken;
          }
        }

        await DataLocal.removeAll();
        return null;
      }
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lấy token thất bại' });
    }

    DataLocal.setAuthStatus('unauthenticated');
    return null;
  },

  // ✅ Lưu user bằng storage
  saveUser: async (user: TypeUser): Promise<void> => {
    try {
      DataLocal.user = user;
      await useInfoUser.getState().saveInfoUser(user);
      storage.set(USER_KEY, JSON.stringify(user));
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu thông tin người dùng thất bại' });
    }
  },

  getUser: async (): Promise<TypeUser | null> => {
    if (DataLocal.user) {
      return DataLocal.user;
    }

    try {
      const storedUser = storage.getString(USER_KEY);
      if (storedUser) {
        const parsedUser: TypeUser = JSON.parse(storedUser);
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

      await useInfoUser.getState().saveInfoUser({} as TypeUser);
      DataLocal.setAuthStatus('unauthenticated');
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: Strings('Đã có lỗi xảy ra, vui lòng khởi động lại ứng dụng'),
      });
    }
  },

  // ✅ Lưu token và user sau khi login thành công
  saveAll: async (res: ResponseAPILogin): Promise<void> => {
    try {
      await DataLocal.saveUser(res.data?.user || {});
      await DataLocal.saveToken(
        res.data.token,
        res.data.refreshToken,
        res.data.expiresIn,
        res.data.refreshExpiresIn,
      );
    } catch (error) {
      Toast.show({ type: 'error', text2: 'Lưu dữ liệu thất bại' });
    }
  },

  // ✅ Gọi API để refresh access token khi hết hạn
  refreshAccessToken: async (refreshToken: string): Promise<TokenType | null> => {
    try {
      const response = await refreshTokenAPI(refreshToken);
      if (response) {
        await DataLocal.saveToken(
          response.accessToken,
          response.refreshToken,
          response.expiresIn || 300,
          response.refreshExpiresIn || 1800,
        );
        return DataLocal.token;
      }
    } catch (error) {
      await DataLocal.removeAll();
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
