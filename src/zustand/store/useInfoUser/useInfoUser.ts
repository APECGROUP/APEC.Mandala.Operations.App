import { create } from 'zustand';
import { TypeUser } from '../../../interface/Authen.interface';
import api from '../../../utils/setup-axios';
import Toast from 'react-native-toast-message';
import { t } from 'i18next';
import { LanguageType } from '../../../languages/locales/type';
import { USER_KEY } from '../../../data/DataLocal';
import { storage } from '../../../views/appProvider/AppProvider';
import { IUser } from '@/screens/authScreen/modal/AuthModal';

interface typeInfo {
  infoUser: IUser | undefined;
  saveInfoUser: (val: IUser) => void;
  fetData: () => Promise<void>;
  updateAvatar: (source: string) => Promise<void>;
}

export const useInfoUser = create<typeInfo>((set, get) => ({
  infoUser: undefined,

  saveInfoUser: (val: IUser) => {
    // console.log('saveInfoUser', val);
    // TODO:bỏ check điều kiện đi
    // if (val.userName) {
    set({ infoUser: val });
    // }
    // try {
    //   storage.set(USER_KEY, JSON.stringify(val));
    // } catch (e) {
    //   console.log('Lỗi khi lưu user bằng MMKV:', e);
    // }
  },

  updateAvatar: async (source: string) => {
    const newAvatar = source;
    // const newAvatar = `${source}&v=${Date.now()}`;
    const updatedUser: TypeUser = {
      ...get().infoUser,
      profile: {
        ...get().infoUser.profile,
        avatar: newAvatar,
      },
    };
    set({ infoUser: updatedUser });
    try {
      storage.set(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {}
  },

  fetData: async () => {
    try {
      const response = await api.get('user/profile');
      if (response.status === 200 && response.data.status === 0) {
        const userData: TypeUser = response.data.data;
        if (userData) {
          set({ infoUser: userData });
          storage.set(USER_KEY, JSON.stringify(userData));
        }
      } else {
        throw new Error('API trả về lỗi');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
    }
  },
}));
