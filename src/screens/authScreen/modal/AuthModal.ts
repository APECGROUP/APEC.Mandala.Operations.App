import {
  IDataListHotel,
  IResponseListHotel,
} from '@/views/modal/modalPickHotel/modal/PickHotelModal';

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
  errors: null;
}

export interface IDataApiLogin {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  userName: string;
  displayName: string;
  email: string;
  signature: null;
  department: string;
  language: null;
  isNotification: null;
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
