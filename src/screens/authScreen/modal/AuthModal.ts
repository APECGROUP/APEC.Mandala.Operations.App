import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import {
  IDataListHotel,
  IResponseListHotel,
} from '@/views/modal/modalPickHotel/modal/PickHotelModal';
import {
  IResponsePickStatus,
  useStatusGlobal,
} from '@/zustand/store/useStatusGlobal/useStatusGlobal';

export interface LoginFormData {
  userName: string;
  password: string;
  hotel: IDataListHotel | undefined;
  isRememberLogin: boolean;
}

export interface ForgotPasswordFormData {
  userName: string;
  hotel: IDataListHotel | undefined;
}

export interface AuthState {
  loginForm: LoginFormData;
  forgotPasswordForm: ForgotPasswordFormData;
  processing: boolean;
  data: IResponseListHotel | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface IResponseAPILogin {
  data: IDataApiLogin;
  pagination: null;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export interface IDataApiLogin {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  refreshExpiresAt: string;
}

export interface IUser {
  userName: string;
  displayName: string;
  email: null;
  avatar: null;
  language: null;
  isNotification: null;
  groups: IGroupAuth[];
  departments: Department[];
  hotelCode: string;
  hotelName: string;
}

export interface Department {
  departmentCode: string;
  departmentName: string;
  departmentShortName: string;
  location: string;
  id: number;
  createdBy: string;
  createdDate: Date;
  deletedDate: null;
  deletedBy: null;
  deleted: string;
}

export interface IGroupAuth {
  groupName: string;
  description: string;
  groupCode: string;
  prApLimit: null;
  dailyApLimit: null;
  monthlyApLimit: null;
  id: number;
  createdBy: string;
  createdDate: Date;
  deletedDate: null;
  deletedBy: null;
  deleted: string;
}

export interface AuthActions {
  setLoginForm: (form: Partial<LoginFormData>) => void;
  setForgotPasswordForm: (form: Partial<ForgotPasswordFormData>) => void;
  login: () => Promise<void>;
  forgotPassword: () => Promise<void>;
  setProcessing: (processing: boolean) => void;
  clearLoginForm: () => void;
  clearForgotPasswordForm: () => void;
  toggleRememberLogin: () => void;
  refetch: () => void;
}

export const fetchStatusGlobal = async () => {
  try {
    const response = await api.get<IResponsePickStatus>(ENDPOINT.GET_STATUS_GLOBAL);
    if (response.status === 200 && response.data.isSuccess) {
      useStatusGlobal.getState().setStatusGlobal(response.data.data);
    } else {
      throw new Error('Failed to fetch global status');
    }
  } catch (error) {
    console.error('Error fetching global status:', error);
  }
};
