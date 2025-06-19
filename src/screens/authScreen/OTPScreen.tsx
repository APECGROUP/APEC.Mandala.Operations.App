import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { vs } from 'react-native-size-matters';
import { getFontSize } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthParams } from '../../navigation/params';
import AppOTP from '../../elements/otp/AppOTP';
import ButtonResend from './component/ButtonResend';
import { AppText } from '../../elements/text/AppText';
import { useAlert } from '../../elements/alert/AlertProvider';
import { AppBlock } from '../../elements/block/Block';
import { useTranslation } from 'react-i18next';
import { LanguageType } from '../../languages/locales/type';
import api from '../../utils/setup-axios';
import Toast from 'react-native-toast-message';
import { ECheckOtpStatus } from '../../interface/Authen.interface';
const endpointGetOtp = {
  register: 'user/gen-otp',
  forgotPassword: 'user/password-reset/gen-otp',
  confirm: 'user/password-reset/gen-otp',
};
const endpointVerifyOtp = {
  register: 'user/verify-otp',
  forgotPassword: 'user/password-reset/verify-otp',
  confirm: 'user/check-otp',
};
const OTPScreen = ({ route, navigation }: NativeStackScreenProps<AuthParams, 'OTPScreen'>) => {
  const { t } = useTranslation();
  const { phone, type } = route.params;
  const { showAlert } = useAlert();
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const onError = () => {
    setIsShowAlert(true);
    showAlert(t(LanguageType.otpWrong), `Vui lòng kiểm tra lại mã OTP`, [
      {
        text: 'Đóng',
        onPress: () => {
          setIsShowAlert(false);
        },
        style: 'cancel',
      },
    ]);
  };

  const onSuccess = (code: string) => {
    if (type === 'confirm') {
      navigation.replace('InputPassword', { phone });
      return;
    }
    navigation.replace('RegisterScreen', { phone: phone, code, type });
  };

  const onBand = () => {
    setIsShowAlert(true);

    showAlert(
      type === 'register' ? t('Đăng ký tài khoản thất bại') : t('Tạo mật khẩu không thành công'),
      type === 'register'
        ? t(
            'Bạn đã nhập sai mã OTP tối đa số lần quy định. Đăng ký tài khoản ví không thành công. Bạn vui lòng thực hiện lại sau 30s',
          )
        : `Bạn đã nhập sai mã OTP tối đa số lần quy định. Tạo mật khẩu đăng nhập mới cho tài khoản ${phone} không thành công. Bạn vui lòng thực hiện lại sau 30s`,
      [
        {
          text: 'Đóng',
          onPress: () => {
            setIsShowAlert(false);
          },
          style: 'cancel',
        },
      ],
    );
  };

  const onSubmit = async (code: string) => {
    try {
      const body = {
        otp: code,
        sessionId,
        userName: phone,
      };
      const resp = await api.post(endpointVerifyOtp[type], body);
      if (resp.status !== 200) {
        throw new Error();
      } else if (resp.data.status === ECheckOtpStatus.SUCCESS) {
        onSuccess(code);
      } else if (
        resp.data.status === ECheckOtpStatus.WRONG_OTP ||
        resp.data.status === ECheckOtpStatus.WRONG_SESSION
      ) {
        onError();
      } else if (resp.data.status === 2) {
        onBand();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
      navigation.goBack();
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getOtp = async () => {
    try {
      if (!phone) {
        return;
      }

      const body = {
        userName: phone,
      };
      const resp = await api.post(endpointGetOtp[type], body);
      if (resp.status !== 200) {
        throw new Error();
      } else {
        setSessionId(resp.data.data.sessionId);
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    // navigation.setOptions({
    //   headerTitle:
    //     type === 'forgotPassword' ? t('Tạo mật khẩu mới') : 'Đăng ký tài khoản',
    // });
    getOtp();
    return () => {};
  }, [getOtp]);

  return (
    <View style={styles.container}>
      <AppBlock>
        <View style={styles.center}>
          <AppText style={styles.title}>Xác thực OTP</AppText>
          <AppText style={styles.bottom10}>
            Vui lòng nhập mã OTP đã được gửi đến{'\n'} số điện thoại {phone}
          </AppText>
          {!isShowAlert && (
            <AppOTP
              containerStyle={{ marginVertical: vs(20) }}
              otpCount={6}
              autoFocus={true}
              // onCodeFilled={onBand}
              onCodeFilled={onSubmit}
            />
          )}
        </View>
        <ButtonResend onPress={getOtp} />
      </AppBlock>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },

  bottom10: {
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginBottom: 10,
  },

  container: {
    flex: 1,
    paddingTop: vs(30),
    justifyContent: 'space-between',
  },
});
