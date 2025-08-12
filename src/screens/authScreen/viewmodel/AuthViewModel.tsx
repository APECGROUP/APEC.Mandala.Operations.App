// screens/authScreen/viewmodel/AuthViewModel.ts
import { useState, useCallback, useRef, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useIsLogin } from '@/zustand/store/useIsLogin/useIsLogin';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import DataLocal from '@/data/DataLocal';
import { goBack } from '@/navigation/RootNavigation';
import {
  LoginFormData,
  ForgotPasswordFormData,
  IResponseAPILogin,
  fetchStatusGlobal,
} from '../modal/AuthModal';
import { useQuery } from '@tanstack/react-query';
import {
  IResponseListHotel,
  fetchListHotel,
} from '@/views/modal/modalPickHotel/modal/PickHotelModal';
import api from '@/utils/setup-axios';
import { ENDPOINT } from '@/utils/Constans';

export const useAuthViewModel = () => {
  const { t } = useTranslation();
  const { showAlert, showToast } = useAlert();
  const { setIsLogin } = useIsLogin();
  const { saveInfoUser } = useInfoUser();

  const [processing, setProcessing] = useState(false);

  // Dùng useReducer để ép re-render khi cần cập nhật UI từ useRef
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const loginFormRef = useRef<LoginFormData>({
    userName: '',
    password: '',
    hotel: undefined,
    isRememberLogin: false,
  });

  const forgotPasswordFormRef = useRef<ForgotPasswordFormData>({
    userName: '',
    hotel: undefined,
  });

  // Trả về giá trị hiện tại của ref
  const loginForm = loginFormRef.current;
  const forgotPasswordForm = forgotPasswordFormRef.current;

  const { data, isLoading, error, refetch } = useQuery<IResponseListHotel>({
    queryKey: ['getListHotel'],
    queryFn: fetchListHotel,
    staleTime: 1000 * 60,
  });

  // setLoginForm KHÔNG forceUpdate khi userName/password thay đổi (chỉ update ref)
  const setLoginForm = useCallback((form: Partial<LoginFormData>) => {
    loginFormRef.current = { ...loginFormRef.current, ...form };
    // Chỉ forceUpdate khi có sự thay đổi KHÔNG PHẢI TỪ VIỆC GÕ (như chọn khách sạn, bật/tắt checkbox, auto-fill)
    // hoặc khi ViewModel muốn chủ động kích hoạt re-render (ví dụ: khi blur input)
    if (form.hotel !== undefined || form.isRememberLogin !== undefined) {
      forceUpdate();
    }
  }, []);

  // setForgotPasswordForm KHÔNG forceUpdate khi userName thay đổi (chỉ update ref)
  const setForgotPasswordForm = useCallback((form: Partial<ForgotPasswordFormData>) => {
    forgotPasswordFormRef.current = { ...forgotPasswordFormRef.current, ...form };
    if (form.hotel !== undefined) {
      forceUpdate();
    }
  }, []);

  // Logic onBlur cho UserName trong LoginScreen
  const handleBlurLoginUserName = useCallback(() => {
    forceUpdate(); // Kích hoạt re-render để cập nhật UI nếu có thông báo lỗi
    if (!loginFormRef.current.userName.trim()) {
      showToast(t('auth.login.emptyUserName'), TYPE_TOAST.ERROR);
    }
  }, [t, showToast]);

  // Logic onBlur cho Password trong LoginScreen
  const handleBlurLoginPassword = useCallback(() => {
    forceUpdate(); // Kích hoạt re-render để cập nhật UI nếu có thông báo lỗi
    if (!loginFormRef.current.password.trim()) {
      showToast(t('auth.login.emptyPassword'), TYPE_TOAST.ERROR);
    }
  }, [t, showToast]);

  // Logic onBlur cho UserName trong ForgotPasswordScreen
  const handleBlurForgotPasswordUserName = useCallback(() => {
    forceUpdate(); // Kích hoạt re-render để cập nhật UI nếu có thông báo lỗi
    if (!forgotPasswordFormRef.current.userName.trim()) {
      showToast(t('auth.login.emptyUserName'), TYPE_TOAST.ERROR);
    }
  }, [t, showToast]);

  const clearLoginForm = useCallback(() => {
    loginFormRef.current = {
      userName: '',
      password: '',
      hotel: undefined,
      isRememberLogin: false,
    };
    forceUpdate();
  }, []);

  const clearForgotPasswordForm = useCallback(() => {
    forgotPasswordFormRef.current = {
      userName: '',
      hotel: undefined,
    };
    forceUpdate();
  }, []);

  const toggleRememberLogin = useCallback(() => {
    loginFormRef.current.isRememberLogin = !loginFormRef.current.isRememberLogin;
    DataLocal.setRememberLogin(loginFormRef.current.isRememberLogin);
    forceUpdate();
  }, []);

  const login = useCallback(async () => {
    setProcessing(true);
    try {
      const params = {
        userName: loginFormRef.current.userName,
        password: loginFormRef.current.password,
        hotelCode: loginFormRef.current.hotel?.code,
      };
      const response = await api.post<IResponseAPILogin>(ENDPOINT.LOGIN, params, {
        headers: { hotelCode: loginFormRef.current.hotel?.code },
        noAuth: true,
      });
      if (response.status !== 200) {
        throw new Error('Login failed');
      }
      if (response.data.isSuccess) {
        if (loginFormRef.current.isRememberLogin) {
          await DataLocal.saveLoginCredentials(
            loginFormRef.current.userName,
            loginFormRef.current.password,
            loginFormRef.current.hotel,
          );
        }
        saveInfoUser(response.data.data.user);
        DataLocal.saveAll(
          response.data,
          loginFormRef.current.hotel?.code!,
          loginFormRef.current.hotel?.name!,
        );
        await fetchStatusGlobal();
        setIsLogin(true);
      } else {
        showToast(
          response?.data?.errors &&
            response.data.errors?.length > 0 &&
            response.data.errors[0]?.message
            ? response.data.errors[0].message
            : t('auth.login.loginError'),
          TYPE_TOAST.ERROR,
        );
      }
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    } finally {
      setProcessing(false);
    }
  }, [saveInfoUser, setIsLogin, showToast, t]);

  const forgotPassword = useCallback(async () => {
    const { userName, hotel } = forgotPasswordFormRef.current;

    try {
      const params = {
        userName: userName.trim(),
      };
      const response = await api.post(ENDPOINT.FORGOT_PASSWORD, params, {
        headers: { hotelCode: hotel?.code },
        noAuth: true,
      });
      if (response.status !== 200) {
        throw new Error('Forgot password failed');
      }
      if (!response.data.isSuccess) {
        showToast(
          response?.data?.errors &&
            response.data.errors?.length > 0 &&
            response.data.errors[0]?.message
            ? response.data.errors[0].message
            : t('auth.forgotPassword.errorForgotPassword'),
          TYPE_TOAST.ERROR,
        );
      } else if (response.data.isSuccess) {
        showAlert(t('auth.forgotPassword.success'), t('auth.forgotPassword.subSuccess'), [
          {
            text: t('auth.forgotPassword.close'),
            onPress: () => {
              goBack();
            },
          },
        ]);
      }
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    }
  }, [showAlert, showToast, t]);

  return {
    data,
    isLoading,
    error,
    loginForm,
    forgotPasswordForm,
    processing,
    setLoginForm,
    setForgotPasswordForm,
    login,
    forgotPassword,
    setProcessing,
    clearLoginForm,
    clearForgotPasswordForm,
    toggleRememberLogin,
    handleBlurLoginUserName, // Export hàm onBlur mới
    handleBlurLoginPassword, // Export hàm onBlur mới
    handleBlurForgotPasswordUserName, // Export hàm onBlur mới
    refetch,
  };
};
