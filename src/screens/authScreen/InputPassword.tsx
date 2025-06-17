import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {s, vs} from 'react-native-size-matters';
import {SCREEN_WIDTH, getFontSize} from '../../constants';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthParams} from '../../navigation/params';
import light from '../../theme/light';
import AppTextInput from '../../elements/textInput/AppTextInput';
import {AppText} from '../../elements/text/AppText';
import {useAlert} from '../../elements/alert/AlertProvider';
import {AppBlock} from '../../elements/block/Block';
import {AppButton} from '../../elements/button/AppButton';
import {useFocusEffect} from '@react-navigation/native';
import {isValidPassword} from '../../utils/validate';
import api from '../../utils/setup-axios';
import DeviceInfo from 'react-native-device-info';
import {useTranslation} from 'react-i18next';
import {LanguageType} from '../../languages/locales/type';
import Toast from 'react-native-toast-message';
import {useInfoUser} from '../../zustand/store/useInfoUser/useInfoUser';
import {ELoginStatus, ResponseAPILogin} from '../../interface/Authen.interface';
import DataLocal from '../../data/DataLocal';
import {getFCMTokenAndSendToServer} from '../../../firebase/fcmService';

const InputPassword = ({
  navigation,
  route,
}: NativeStackScreenProps<AuthParams, 'InputPassword'>) => {
  const {phone} = route.params;
  const {t} = useTranslation();
  const {showAlert} = useAlert();
  const [password, setPassword] = useState('');
  const {infoUser} = useInfoUser();

  const [passwordError, setPasswordError] = useState('');
  const [processing, setProcessing] = useState<boolean | undefined>(false);
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleBlurPassword = () => {
    if (password.length > 0 && !isValidPassword(password)) {
      setPasswordError(
        'Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt',
      );
    }
  };
  const handleFocusPassword = () => setPasswordError('');

  const onSuccess = async (response: ResponseAPILogin) => {
    Toast.show({
      type: 'success',
      text2: t('Đăng nhập thành công'),
    });
    await DataLocal.saveAll(response);
    getFCMTokenAndSendToServer(t);
    return;
  };

  const onBand = () => {
    setProcessing(undefined);

    showAlert(
      'Đăng nhập không thành công',
      `Bạn đã nhập sai mật khẩu tối đa số lần quy định. Đăng nhập tài khoản ví ${phone} không thành công. Bạn vui lòng thực hiện lại sau 30s`,
      [
        {
          text: 'Đóng',
          onPress: () => {
            setProcessing(false);
          },
          style: 'cancel',
        },
      ],
    );
  };

  const onSubmit = async () => {
    try {
      setProcessing(true);
      const body = {
        userName: phone,
        password,
        deviceId: DeviceInfo.getDeviceId(),
        deviceName:
          typeof DeviceInfo.getDeviceName() === 'string'
            ? DeviceInfo.getDeviceName()
            : 'simulator',
        deviceInfo: DeviceInfo.getSystemVersion(),
      };
      const resp = await api.post<ResponseAPILogin>('user/login', body, {
        noAuth: true,
      });
      setProcessing(false);
      if (resp.status !== 200) {
        throw new Error();
      } else if (resp.data.status === ELoginStatus.SUCCESS) {
        onSuccess(resp.data);
      } else if (
        resp.data.status === ELoginStatus.INVALID_USERNAME_OR_PASSWORD
      ) {
        // Toast.show({
        //   type: 'error',
        //   text2: t('Mật khẩu không chính xác, vui lòng kiểm tra lại'),
        // });
        setPasswordError(t('Mật khẩu không chính xác, vui lòng kiểm tra lại'));
      } else if (resp.data.status === ELoginStatus.FAILED) {
        throw new Error();
      } else {
        Toast.show({
          type: 'error',
          text2: t('Tài khoản ví đã bị khóa. Vui lòng kiểm tra lại'),
        });
        onBand();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
      setProcessing(false);
    }
  };

  const onForgotPassword = () => {
    setProcessing(undefined);

    showAlert(
      'Tạo mật khẩu mới',
      `Bạn đang thực hiện tạo mật khẩu đăng nhập mới cho tài khoản ví ${phone}. Bạn có chắc muốn tiếp tục?`,
      [
        {
          text: 'Thoát',
          onPress: () => {
            setProcessing(false);
          },
          style: 'cancel',
        },
        {
          text: 'Tiếp tục',
          onPress: () => {
            setProcessing(false);
            navigation.navigate('OTPScreen', {phone, type: 'forgotPassword'});
          },
        },
      ],
    );
  };
  const onLoginAccountOther = () => {
    // setPassword && setPassword('');
    // navigation.popToTop();

    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };

  useFocusEffect(
    useCallback(() => {
      setProcessing(false);
      return () => {
        setProcessing(undefined);
      };
    }, []),
  );

  return (
    <AppBlock style={styles.container}>
      <AppBlock>
        <View style={styles.center}>
          <AppText style={styles.title}>
            Xin chào {infoUser?.profile?.fullName || ''}
          </AppText>
          <AppText style={styles.title}>{phone}</AppText>

          <AppTextInput
            label="Nhập mật khẩu"
            secureTextEntry
            errorColor={light.danger}
            errorMessage={passwordError}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Nhập mật khẩu"
            onBlur={handleBlurPassword}
            onFocus={handleFocusPassword}
            inputStyle={styles.inputStyle}
            containerStyle={{width: SCREEN_WIDTH - s(32), marginTop: vs(20)}}
          />
          <AppBlock width={'100%'} mt={10} row justifyContent="space-between">
            <TouchableWithoutFeedback onPress={onForgotPassword}>
              <AppText primary>Quên mật khẩu</AppText>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onLoginAccountOther}>
              <AppText primary>Đăng nhập tài khoản khác</AppText>
            </TouchableWithoutFeedback>
          </AppBlock>
        </View>
      </AppBlock>

      <AppButton
        width={SCREEN_WIDTH - s(32)}
        onPress={onSubmit}
        disabled={!isValidPassword(password)}
        processing={processing}
        primary
        text="Đăng nhập"
      />
    </AppBlock>
  );
};

export default InputPassword;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  inputStyle: {
    width: '100%',
    height: vs(40),
    backgroundColor: light.white,
  },
  bottom10: {
    marginBottom: 10,
  },
  title: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: vs(30),
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: getFontSize(12),
  },
});
