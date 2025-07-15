import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useIsLogin } from '@/zustand/store/useIsLogin/useIsLogin';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import DataLocal from '@/data/DataLocal';
import { navigate, goBack } from '@/navigation/RootNavigation';
import { removeVietnameseTones } from '../LoginScreen';
import { AuthState, AuthActions, LoginFormData, ForgotPasswordFormData } from '../modal/AuthModal';

export const useAuthViewModel = (): AuthState & AuthActions => {
  const { t } = useTranslation();
  const { showAlert, showToast } = useAlert();
  const { setIsLogin } = useIsLogin();
  const { saveInfoUser, infoUser } = useInfoUser();

  const [processing, setProcessing] = useState(false);
  const [loginForm, setLoginFormState] = useState<LoginFormData>({
    userName: '',
    password: '',
    hotel: { id: undefined, name: undefined },
    isRememberLogin: false,
  });

  const [forgotPasswordForm, setForgotPasswordFormState] = useState<ForgotPasswordFormData>({
    userName: '',
    hotel: { id: undefined, name: undefined },
  });

  const setLoginForm = useCallback((form: Partial<LoginFormData>) => {
    setLoginFormState(prev => ({ ...prev, ...form }));
  }, []);

  const setForgotPasswordForm = useCallback((form: Partial<ForgotPasswordFormData>) => {
    setForgotPasswordFormState(prev => ({ ...prev, ...form }));
  }, []);

  const clearLoginForm = useCallback(() => {
    setLoginFormState({
      userName: '',
      password: '',
      hotel: { id: undefined, name: undefined },
      isRememberLogin: false,
    });
  }, []);

  const clearForgotPasswordForm = useCallback(() => {
    setForgotPasswordFormState({
      userName: '',
      hotel: { id: undefined, name: undefined },
    });
  }, []);

  const toggleRememberLogin = useCallback(() => {
    setLoginForm({ isRememberLogin: !loginForm.isRememberLogin });
    DataLocal.setRememberLogin(!loginForm.isRememberLogin);
  }, [loginForm.isRememberLogin, setLoginForm]);

  const login = useCallback(async () => {
    setProcessing(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
    setProcessing(false);

    const { userName, password, hotel } = loginForm;

    if (removeVietnameseTones(userName.toLowerCase()).includes('reset')) {
      await DataLocal.saveLoginCredentials(userName, password, hotel);

      return showAlert(
        t('auth.login.resetPassword'),
        t('auth.login.subResetPassword'),
        [
          {
            text: t('auth.login.changePassword'),
            onPress: () => navigate('ChangePasswordScreen', { type: 'reset' }),
          },
        ],
        undefined,
        undefined,
        true,
      );
    }

    if (removeVietnameseTones(userName.toLowerCase()).includes('duyet')) {
      saveInfoUser({ ...infoUser, isApprove: true });
      setIsLogin(true);
      await DataLocal.saveLoginCredentials(userName, password, hotel);
      // if (isRememberLogin) {
      //   showToast('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
      // }
      return;
    }

    if (!removeVietnameseTones(userName.toLowerCase()).includes('dung')) {
      saveInfoUser({ ...infoUser, isApprove: false });
      return showToast(t('auth.login.loginError'), TYPE_TOAST.ERROR);
    }

    if (password !== '123456') {
      return showToast(t('auth.login.loginError'), TYPE_TOAST.ERROR);
    }

    setIsLogin(true);
    await DataLocal.saveLoginCredentials(userName, password, hotel);
    // if (isRememberLogin) {
    //   showToast('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
    // }
  }, [loginForm, showAlert, showToast, t, saveInfoUser, infoUser, setIsLogin]);

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
  };
};
