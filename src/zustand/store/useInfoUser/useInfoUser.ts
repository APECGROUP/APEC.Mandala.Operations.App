import { create } from 'zustand';
// Giữ nguyên TypeUser để tương thích với cấu trúc hiện có nếu IUser không phải là cùng một kiểu
import api from '../../../utils/setup-axios';
import Toast from 'react-native-toast-message';
import { t } from 'i18next';
import { LanguageType } from '../../../languages/locales/type';
import { USER_KEY } from '../../../data/DataLocal';
import { storage } from '../../../views/appProvider/AppProvider';
import { IUser } from '@/screens/authScreen/modal/AuthModal';

// Đảm bảo interface `typeInfo` phản ánh đúng các hàm được triển khai
interface typeInfo {
  infoUser: Partial<IUser> | undefined;
  deviceToken?: string;
  setDeviceToken: (v: string) => void;
  saveInfoUser: (val: Partial<IUser>) => void;
  fetData: () => Promise<void>;
  updateAvatar: (source: string) => Promise<void>;
  toggleTurnOnOffNotification: (status: boolean) => void;
}

export const useInfoUser = create<typeInfo>((set, get) => ({
  infoUser: undefined,
  deviceToken: undefined,

  setDeviceToken: (val: string) => {
    set({ deviceToken: val });
  },

  saveInfoUser: (val: Partial<IUser>) => {
    set({ infoUser: val });
  },

  updateAvatar: async (source: string) => {
    // Tạo một bản sao của infoUser hiện có và cập nhật chỉ trường avatar trong profile
    const prevUser = get().infoUser || {};
    const updatedUser: IUser = {
      ...(prevUser as IUser), // Đảm bảo infoUser tồn tại trước khi spread
      avatar: source,
    };
    set({ infoUser: updatedUser }); // Cập nhật state trong Zustand
    try {
      storage.set(USER_KEY, JSON.stringify(updatedUser)); // Lưu vào MMKV storage
    } catch (error) {
      console.error('Lỗi khi lưu người dùng vào MMKV:', error); // Log lỗi rõ ràng hơn
    }
  },
  toggleTurnOnOffNotification: async (status: boolean) => {
    // Tạo một bản sao của infoUser hiện có và cập nhật chỉ trường avatar trong profile
    const prevUser = get().infoUser || {};
    const updatedUser: IUser = {
      ...(prevUser as IUser),
      isNotification: status,
    };
    set({ infoUser: updatedUser }); // Cập nhật state trong Zustand
    try {
      storage.set(USER_KEY, JSON.stringify(updatedUser)); // Lưu vào MMKV storage
    } catch (error) {
      console.error('Lỗi khi lưu người dùng vào MMKV:', error); // Log lỗi rõ ràng hơn
    }
  },

  fetData: async () => {
    try {
      const response = await api.get('user/profile');
      if (response.status === 200 && response.data.status === 0) {
        const userData: IUser = response.data.data; // Đảm bảo kiểu dữ liệu phù hợp
        if (userData) {
          set({ infoUser: userData }); // Cập nhật state với dữ liệu đầy đủ từ API
          storage.set(USER_KEY, JSON.stringify(userData)); // Lưu dữ liệu đầy đủ vào MMKV storage
        }
      } else {
        throw new Error('API trả về lỗi hoặc trạng thái không thành công');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
      console.error('Lỗi khi lấy dữ liệu người dùng:', error); // Log lỗi rõ ràng hơn
    }
  },
}));
