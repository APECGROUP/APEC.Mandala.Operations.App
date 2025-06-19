import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { s, vs } from 'react-native-size-matters';
import { SCREEN_WIDTH, getFontSize } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthParams } from '../../navigation/params';
import light from '../../theme/light';
import AppTextInput from '../../elements/textInput/AppTextInput';
import { AppButton } from '../../elements/button/AppButton';
import { AppText } from '../../elements/text/AppText';
import { useAlert } from '../../elements/alert/AlertProvider';
import { AppBlock } from '../../elements/block/Block';
import api from '../../utils/setup-axios';
import DeviceInfo from 'react-native-device-info';
import { isValidPassword } from '../../utils/validate';
import Toast from 'react-native-toast-message';
import { LanguageType } from '../../languages/locales/type';
import { useTranslation } from 'react-i18next';
import DataLocal from '../../data/DataLocal';
import { ERegisterStatus, ResponseAPILogin } from '../../interface/Authen.interface';
import { getFCMTokenAndSendToServer } from '../../../firebase/fcmService';
import IconCheckBox from '../../../assets/icon/IconCheckBox';
import IconUnCheckBox from '../../../assets/icon/IconUnCheckBox';

const endpointSubmit = {
  register: 'user/register',
  forgotPassword: 'user/password-reset/submit',
  confirm: 'user/password-reset/gen-otp',
};
const RegisterScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<AuthParams, 'RegisterScreen'>) => {
  const { t } = useTranslation();
  const { phone, type } = route.params;
  const { showAlert } = useAlert();
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');
  const [isSelected, setIsSelected] = useState(type === 'forgotPassword' ? true : false);
  const [processing, setProcessing] = useState<boolean | undefined>(false);
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
    }
  };
  const handleSelect = () => {
    setIsSelected(i => !i);
  };
  const handleRePasswordChange = (text: string) => {
    setRePassword(text);
    if (rePasswordError) {
      setRePasswordError('');
    }
  };

  const handleBlurPassword = () => {
    if (password.length > 0 && !isValidPassword(password)) {
      setPasswordError(
        'Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt',
      );
    }
  };

  const handleBlurRePassword = () => {
    if (rePassword.length > 0 && rePassword !== password) {
      setRePasswordError('Mật khẩu nhập lại không khớp');
    }
  };

  const handleFocusPassword = () => setPasswordError('');
  const handleFocusRePassword = () => setRePasswordError('');

  const handleLogin = async (response: ResponseAPILogin) => {
    if (type === 'forgotPassword') {
      navigation.popToTop();
      return;
    }
    await DataLocal.saveAll(response);
    setProcessing(false);
    getFCMTokenAndSendToServer(t);

    // navigation.popToTop();
  };
  console.log('type: ', type);
  const showAlertSuccess = (response: ResponseAPILogin) => {
    setProcessing(undefined);
    if (type === 'register') {
      handleLogin(response);
      return;
    }
    showAlert(
      'Tạo mật khẩu thành công ',
      `Bạn đã tạo mật khẩu đăng nhập mới cho tài khoản ví ${phone} thành công. Mật khẩu được dùng để đăng nhập những lần tới\n Đăng nhập vào app để cùng trải nghiệm dịch vụ của chúng tôi`,
      [
        {
          text: 'Đăng nhập',
          onPress: () => handleLogin(response),
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
          typeof DeviceInfo.getDeviceName() === 'string' ? DeviceInfo.getDeviceName() : 'simulator',
        deviceInfo: DeviceInfo.getSystemVersion(),
      };
      const resp = await api.post(endpointSubmit[type], body);
      setProcessing(false);

      if (resp.status !== 200) {
        throw new Error();
      } else if (resp.data.status === ERegisterStatus.SUCCESS) {
        showAlertSuccess(resp.data);
      } else if (resp.data.status === ERegisterStatus.USER_CONFLICT) {
        Toast.show({
          type: 'error',
          text2: t('Tài khoản đã được tồn tại'),
        });
        navigation.popToTop();
      } else {
        throw new Error();
      }
    } catch (err: any) {
      setProcessing(false);
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
    }
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerTitle:
  //       type === 'forgotPassword' ? 'Tạo mật khẩu mới' : 'Đăng ký tài khoản',
  //   });

  //   return () => {};
  // }, []);

  return (
    <AppBlock style={styles.container}>
      <View style={styles.center}>
        <AppText style={styles.title}>Tạo mật khẩu</AppText>
        <AppText style={styles.bottom10}>
          Để đảm bảo tính bảo mật, vui lòng tạo mật khẩu có ít nhất 8 ký tự, trong đó có chữ hoa,
          chữ thường, số và ký tự đặc biệt.
        </AppText>
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
          containerStyle={{ width: SCREEN_WIDTH - s(32), marginTop: vs(20) }}
        />
        <AppTextInput
          label="Xác nhận lại mật khẩu"
          secureTextEntry
          errorColor={light.danger}
          errorMessage={rePasswordError}
          value={rePassword}
          onChangeText={handleRePasswordChange}
          placeholder="Xác nhận lại mật khẩu"
          onBlur={handleBlurRePassword}
          onFocus={handleFocusRePassword}
          inputStyle={styles.inputStyle}
          containerStyle={{ width: SCREEN_WIDTH - s(32), marginTop: vs(20) }}
        />
        {type !== 'forgotPassword' && (
          <TouchableOpacity onPress={handleSelect} activeOpacity={1} style={styles.button}>
            {isSelected ? (
              <IconCheckBox style={styles.mr3} />
            ) : (
              <IconUnCheckBox style={styles.mr3} />
            )}
            <AppText>
              Tôi đồng ý với{' '}
              <AppText onPress={() => {}} style={{ color: light.primary }}>
                Điều khoản sử dụng
              </AppText>{' '}
              và{' '}
              <AppText onPress={() => {}} style={{ color: light.primary }}>
                Chính sách{'\n'} bảo mật
              </AppText>{' '}
              của app
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <AppButton
        width={SCREEN_WIDTH - s(32)}
        onPress={onSubmit}
        disabled={!isValidPassword(password) || rePassword !== password || !isSelected}
        primary
        processing={processing}
        text="Tiếp tục"
      />
    </AppBlock>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  button: {
    width: SCREEN_WIDTH - s(32),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
  },
  mr3: {
    marginRight: s(3),
  },

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
    textAlign: 'center',
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
  },
});
