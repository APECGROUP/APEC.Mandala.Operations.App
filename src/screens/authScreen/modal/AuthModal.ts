import { typeHotel } from '../LoginScreen';

export interface LoginFormData {
  userName: string;
  password: string;
  hotel: typeHotel;
  isRememberLogin: boolean;
}

export interface ForgotPasswordFormData {
  userName: string;
  hotel: typeHotel;
}

export interface AuthState {
  loginForm: LoginFormData;
  forgotPasswordForm: ForgotPasswordFormData;
  processing: boolean;
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
}
