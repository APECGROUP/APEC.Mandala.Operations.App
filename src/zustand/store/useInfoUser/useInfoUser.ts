import {create} from 'zustand';
import {TypeUser} from '../../../interface/Authen.interface';
import api from '../../../utils/setup-axios';
import Toast from 'react-native-toast-message';
import {t} from 'i18next';
import {LanguageType} from '../../../languages/locales/type';
import {USER_KEY} from '../../../data/DataLocal';
import {storage} from '../../../views/appProvider/AppProvider';

const fakeUser: TypeUser = {
  id: 1,
  userName: 'Tuan',
  authId: 'auth_abc123xyz',
  status: 'active',
  profile: {
    id: 101,
    email: 'tuanphamnd99@gmail.com',
    mobile: '0949328231',
    firstName: 'Phạm',
    lastName: 'Tuấn',
    fullName: 'Phạm Văn Tuấn',
    gender: 'male',
    address: 'Xuân Kiên, Xuân Trường, Nam Định',
    emailVerificationDate: null,
    profileVerificationDate: new Date('2023-06-15T10:30:00Z'),
    dob: '2000-01-20',
    occupation: 'Software Engineer',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1BQqwCLUL_IUt5_tm6kIhnfDXcQE-AX325yTtwdlgxxQJRng-aJkCDo8SCi5RTJShlOGyZlQpqqDpNGMRFO3sxA',
    jobPosition: 'Senior Developer',
    emailVerified: true,
    verified: true,
    pinSet: true,
    ssn: '036200004079',
    ssnIssueDate: new Date('2010-01-15T00:00:00Z'),
    ssnIssuePlace: 'TP.HCM',
    language: null,
    district: null,
    city: null,
    country: 'Vietnam',
    postalCode: null,
    currency: null,
    ssnType: null,
  },
};

interface typeInfo {
  infoUser: TypeUser;
  saveInfoUser: (val: TypeUser) => void;
  fetData: () => Promise<void>;
  updateAvatar: (source: string) => Promise<void>;
}

export const useInfoUser = create<typeInfo>((set, get) => ({
  infoUser: fakeUser as TypeUser,

  saveInfoUser: (val: TypeUser) => {
    console.log('saveInfoUser', val);
    // TODO:bỏ check điều kiện đi
    if (val.id) {
      set({infoUser: val});
    }
    // try {
    //   storage.set(USER_KEY, JSON.stringify(val));
    // } catch (e) {
    //   console.log('Lỗi khi lưu user bằng MMKV:', e);
    // }
  },

  updateAvatar: async (source: string) => {
    const newAvatar = `${source}&v=${Date.now()}`;

    const updatedUser: TypeUser = {
      ...get().infoUser,
      profile: {
        ...get().infoUser.profile,
        avatar: newAvatar,
      },
    };

    set({infoUser: updatedUser});
    try {
      storage.set(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.log('Lỗi khi lưu avatar bằng MMKV:', error);
    }
  },

  fetData: async () => {
    try {
      console.log('fetData');
      const response = await api.get('user/profile');
      if (response.status === 200 && response.data.status === 0) {
        const userData: TypeUser = response.data.data;
        if (userData) {
          set({infoUser: userData});
          storage.set(USER_KEY, JSON.stringify(userData));
        }
      } else {
        throw new Error('API trả về lỗi');
      }
    } catch (error) {
      console.log('Lỗi fetData user:', error);
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
    }
  },
}));
