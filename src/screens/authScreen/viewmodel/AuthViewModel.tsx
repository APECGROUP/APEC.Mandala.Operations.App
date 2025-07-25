import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useIsLogin } from '@/zustand/store/useIsLogin/useIsLogin';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import DataLocal from '@/data/DataLocal';
import { goBack } from '@/navigation/RootNavigation';
import {
  AuthState,
  AuthActions,
  LoginFormData,
  ForgotPasswordFormData,
  IResponseAPILogin,
} from '../modal/AuthModal';
import { useQuery } from '@tanstack/react-query';
import {
  IResponseListHotel,
  fetchListHotel,
} from '@/views/modal/modalPickHotel/modal/PickHotelModal';
import api from '@/utils/setup-axios';

export const useAuthViewModel = (): AuthState & AuthActions => {
  const { t } = useTranslation();
  const { showAlert, showToast } = useAlert();
  const { setIsLogin } = useIsLogin();
  const { saveInfoUser, infoUser } = useInfoUser();

  const [processing, setProcessing] = useState(false);
  const [loginForm, setLoginFormState] = useState<LoginFormData>({
    userName: '',
    password: '',
    hotel: undefined,
    isRememberLogin: false,
  });

  const [forgotPasswordForm, setForgotPasswordFormState] = useState<ForgotPasswordFormData>({
    userName: '',
    hotel: undefined,
  });

  const { data, isLoading, error, refetch } = useQuery<IResponseListHotel>({
    queryKey: ['getListHotel'],
    queryFn: fetchListHotel,
    staleTime: 1000 * 60, // 1 phút
  });

  console.log('render  auth: ', loginForm, forgotPasswordForm);
  useEffect(() => {
    console.log('LoginForm updated:', loginForm);
  }, [loginForm]);
  const setLoginForm = useCallback((form: Partial<LoginFormData>) => {
    setLoginFormState(prev => {
      const newState = { ...prev, ...form };
      console.log('set nê: newState sau khi cập nhật:', newState); // Log newState
      return newState;
    });
  }, []);

  const setForgotPasswordForm = useCallback((form: Partial<ForgotPasswordFormData>) => {
    setForgotPasswordFormState(prev => ({ ...prev, ...form }));
  }, []);

  const clearLoginForm = useCallback(() => {
    console.log('clearLoginForm');
    setLoginFormState({
      userName: '',
      password: '',
      hotel: undefined,
      isRememberLogin: false,
    });
  }, []);

  const clearForgotPasswordForm = useCallback(() => {
    setForgotPasswordFormState({
      userName: '',
      hotel: undefined,
    });
  }, []);

  const toggleRememberLogin = useCallback(() => {
    setLoginForm({ isRememberLogin: !loginForm.isRememberLogin });
    DataLocal.setRememberLogin(!loginForm.isRememberLogin);
  }, [loginForm.isRememberLogin, setLoginForm]);

  const login = useCallback(async () => {
    try {
      setProcessing(true);
      const params = {
        userName: loginForm.userName,
        password: loginForm.password,
        hotelCode: loginForm.hotel?.code,
      };
      const response = await api.post<IResponseAPILogin>('/api/spc/user/login', params, {
        headers: { hotelCode: loginForm.hotel?.code },
      });
      console.log('response login:', response);
      if (response.status !== 200) {
        setProcessing(false);
        throw new Error();
      } else {
        const dataApi = response.data;
        if (dataApi.isSuccess) {
          console.log('success', dataApi);
          if (loginForm.isRememberLogin) {
            await DataLocal.saveLoginCredentials(
              loginForm.userName,
              loginForm.password,
              loginForm.hotel,
            );
          }
          setProcessing(false);
          saveInfoUser(dataApi.data.user);
          setIsLogin(true);
        } else {
          showToast(t('auth.login.loginError'), TYPE_TOAST.ERROR);
        }
      }
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    } finally {
      setProcessing(false);
    }
  }, [
    loginForm.hotel,
    loginForm.isRememberLogin,
    loginForm.password,
    loginForm.userName,
    saveInfoUser,
    setIsLogin,
    showToast,
    t,
  ]);
  // const login = useCallback(async () => {
  //   setProcessing(true);
  //   await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
  //   setProcessing(false);

  //   const { userName, password, hotel } = loginForm;

  //   if (removeVietnameseTones(userName.toLowerCase()).includes('reset')) {
  //     await DataLocal.saveLoginCredentials(userName, password, hotel);

  //     return showAlert(
  //       t('auth.login.resetPassword'),
  //       t('auth.login.subResetPassword'),
  //       [
  //         {
  //           text: t('auth.login.changePassword'),
  //           onPress: () => navigate('ChangePasswordScreen', { type: 'reset' }),
  //         },
  //       ],
  //       undefined,
  //       undefined,
  //       true,
  //     );
  //   }

  //   if (removeVietnameseTones(userName.toLowerCase()).includes('duyet')) {
  //     saveInfoUser({ ...infoUser, isApprove: true });
  //     setIsLogin(true);
  //     await DataLocal.saveLoginCredentials(userName, password, hotel);
  //     // if (isRememberLogin) {
  //     //   showToast('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
  //     // }
  //     return;
  //   }

  //   if (!removeVietnameseTones(userName.toLowerCase()).includes('dung')) {
  //     return showToast(t('auth.login.loginError'), TYPE_TOAST.ERROR);
  //   }

  //   if (password !== '123456') {
  //     return showToast(t('auth.login.loginError'), TYPE_TOAST.ERROR);
  //   }

  //   saveInfoUser({ ...infoUser, isApprove: false });
  //   setIsLogin(true);
  //   await DataLocal.saveLoginCredentials(userName, password, hotel);
  //   // if (isRememberLogin) {
  //   //   showToast('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
  //   // }
  // }, [loginForm, showAlert, showToast, t, saveInfoUser, infoUser, setIsLogin]);

  const forgotPassword = useCallback(async () => {
    const { userName } = forgotPasswordForm;

    if (userName.toLowerCase() === 'dung') {
      showAlert(t('auth.forgotPassword.success'), t('auth.forgotPassword.subSuccess'), [
        {
          text: t('auth.forgotPassword.close'),
          onPress: () => {
            goBack();
          },
        },
      ]);
      return;
    }
    return showToast(t('auth.forgotPassword.errorForgotPassword'), TYPE_TOAST.ERROR);
  }, [forgotPasswordForm, showAlert, showToast, t]);

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
    refetch,
  };
};
