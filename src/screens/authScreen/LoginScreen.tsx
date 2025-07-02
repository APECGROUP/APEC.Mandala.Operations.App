import { ImageBackground, Keyboard, StyleSheet, TextInput, View, StatusBar } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { s, vs } from 'react-native-size-matters';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ToastContainer from '@/elements/toast/ToastContainer';
import { Colors } from '@/theme/Config';
import { SCREEN_WIDTH, getFontSize } from '@/constants';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppButton } from '@/elements/button/AppButton';
import { AppText } from '@/elements/text/AppText';
import AppTextInput from '@/elements/textInput/AppTextInput';
import { AuthParams } from '@/navigation/params';
import light from '@/theme/light';
import { PaddingHorizontal } from '@/utils/Constans';
import { useIsLogin } from '@/zustand/store/useIsLogin/useIsLogin';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import Images from '@assets/image/Images';
import { useTranslation } from 'react-i18next';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DataLocal from '@/data/DataLocal';
import { useAutoLogin } from '@/hook/useAutoLogin';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

export type typeHotel = {
  id: number | string | undefined;
  name: number | string | undefined;
};
export type typeNcc = {
  id: string | undefined;
  name: string | undefined;
};

// Hàm loại bỏ dấu tiếng Việt
export const removeVietnameseTones = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

const LoginScreen = ({ navigation }: NativeStackScreenProps<AuthParams, 'LoginScreen'>) => {
  const { t } = useTranslation();
  const { setIsLogin } = useIsLogin();
  const { saveInfoUser, infoUser } = useInfoUser();
  const { credentials, loading: loadingCredentials } = useAutoLogin();
  const refToast = useRef<any>(null);
  const refPassword = useRef<TextInput>(null);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [hotel, setHotel] = useState<typeHotel>({} as typeHotel);
  const { isRememberLogin, setIsRememberLogin } = useIsLogin();
  const [processing, setProcessing] = useState<boolean | undefined>(false);

  // Tự động điền thông tin đăng nhập nếu có
  useEffect(() => {
    if (credentials && !loadingCredentials) {
      setUserName(credentials.username);
      setPassword(credentials.password);
      if (credentials.hotel && credentials.hotel.id) {
        setHotel(credentials.hotel);
      }
      setIsRememberLogin(true);
      DataLocal.setRememberLogin(true);
    }
  }, [credentials, loadingCredentials, setIsRememberLogin]);

  const disabled = !userName || !password || !hotel.id;
  const { bottom } = useSafeAreaInsets();

  const onSubmit = async () => {
    setProcessing(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
    setProcessing(false);

    if (removeVietnameseTones(userName.toLocaleLowerCase()).includes('duyet')) {
      saveInfoUser({ ...infoUser, isApprove: true });
      setIsLogin(true);
      // Luôn lưu thông tin đăng nhập
      await DataLocal.saveLoginCredentials(userName, password, hotel);
      // Chỉ hiện thông báo khi user tích "Nhớ đăng nhập"
      if (isRememberLogin) {
        refToast.current?.show('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
      }
    }
    if (!removeVietnameseTones(userName.toLocaleLowerCase()).includes('dung')) {
      saveInfoUser({ ...infoUser, isApprove: false });
      return refToast.current?.show(t('auth.login.loginError'), TYPE_TOAST.ERROR);
    } else if (password === '123') {
      return refToast.current?.show(t('auth.login.loginError'), TYPE_TOAST.ERROR);
    } else {
      setIsLogin(true);
      // Luôn lưu thông tin đăng nhập
      await DataLocal.saveLoginCredentials(userName, password, hotel);
      // Chỉ hiện thông báo khi user tích "Nhớ đăng nhập"
      if (isRememberLogin) {
        refToast.current?.show('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
      }
    }

    // try {
    //   setProcessing(true);
    //   const body = {
    //     userName: phone,
    //     deviceId: DeviceInfo.getDeviceId(),
    //     deviceName:
    //       typeof DeviceInfo.getDeviceName() === 'string'
    //         ? DeviceInfo.getDeviceName()
    //         : 'simulator',
    //     deviceInfo: DeviceInfo.getSystemVersion(),
    //   };

    //   const resp = await api.post('user/check-login', body, {noAuth: true});
    //   setProcessing(false);
    //   await DataLocal.saveAll(resp);
    //   DataLocal.setRememberLogin(isRememberLogin);
    //   // Luôn lưu credentials
    //   await DataLocal.saveLoginCredentials(userName, password, hotel);
    //   // Chỉ hiện thông báo khi user tích "Nhớ đăng nhập"
    //   if (isRememberLogin) {
    //     refToast.current?.show('Đã lưu thông tin đăng nhập', TYPE_TOAST.SUCCESS);
    //   }
    //   if (resp.status !== 200) {
    //     throw new Error();
    //   }
    // } catch (err: any) {
    //   setProcessing(false);
    //   Toast.show({
    //     type: 'error',
    //     text2: t(LanguageType.errorTryAgain),
    //   });
    // } finally {
    // }
  };

  const onBlurUserName = () => {
    if (!userName.trim()) {
      refToast.current?.show(t('auth.login.emptyUserName'), TYPE_TOAST.ERROR);
    }
  };

  const onBlurPassword = () => {
    if (!password.trim()) {
      refToast.current?.show(t('auth.login.emptyPassword'), TYPE_TOAST.ERROR);
    }
  };

  const onPickHotel = () => {
    Keyboard.dismiss();
    navigation.navigate('ModalPickHotel', { hotel, setHotel });
  };

  const onSave = () => {
    setIsRememberLogin(!isRememberLogin);
    DataLocal.setRememberLogin(!isRememberLogin);
  };

  const onForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  // const handleClearCredentials = () => {
  //   // Refresh form khi xóa credentials
  //   setUserName('');
  //   setPassword('');
  //   setHotel({} as typeHotel);
  //   setIsRememberLogin(false);
  //   DataLocal.setRememberLogin(false);
  // };

  console.log('hotel', hotel);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="white" />
      <ViewContainer>
        <View style={[styles.container, { paddingBottom: bottom }]}>
          <View style={styles.center}>
            <ImageBackground style={styles.imageBackground} source={Images.BackgroundLogin}>
              <AppText size={20} weight="700" color={Colors.WHITE}>
                {t('auth.login.title')}
              </AppText>
              <AppText size={14} weight="500" color={Colors.WHITE} mt={8}>
                {t('auth.login.subtitle')}
              </AppText>
            </ImageBackground>

            {/* Hiển thị thông tin credentials đã lưu */}

            <AppTextInput
              required
              labelStyle={styles.labelUser}
              label={t('auth.login.userName')}
              placeholderTextColor={light.placeholderTextColor}
              value={userName}
              maxLength={20}
              onChangeText={setUserName}
              onBlur={onBlurUserName}
              placeholder={t('auth.login.inputUserName')}
              onSubmitEditing={() => refPassword.current?.focus()}
              inputStyle={styles.inputStyle}
              containerStyle={{
                marginBottom: vs(18),
                width: SCREEN_WIDTH - PaddingHorizontal * 2,
              }}
            />

            <AppTextInput
              refName={refPassword}
              required
              labelStyle={styles.labelPassword}
              label={t('auth.login.password')}
              secureTextEntry
              value={password}
              maxLength={20}
              onChangeText={setPassword}
              onSubmitEditing={onPickHotel}
              onBlur={onBlurPassword}
              placeholder={t('auth.login.inputPassword')}
              inputStyle={styles.inputStyle}
              containerStyle={{
                marginBottom: vs(18),
                width: SCREEN_WIDTH - PaddingHorizontal * 2,
              }}
            />
            <AppBlockButton onPress={onPickHotel}>
              <AppTextInput
                required
                editable={false}
                labelStyle={styles.labelPassword}
                label={t('auth.login.hotel')}
                placeholderTextColor={light.placeholderTextColor}
                noBorder
                value={hotel?.name?.toString()}
                placeholder={t('auth.login.pickHotel')}
                rightIcon={
                  <IconArrowRight
                    stroke={Colors.ICON_SECONDARY}
                    style={{ transform: [{ rotate: '90deg' }], marginRight: s(2) }}
                  />
                }
                // onPress={onPickHotel}
                inputStyle={styles.inputStyle}
                containerStyle={{
                  width: SCREEN_WIDTH - PaddingHorizontal * 2,
                }}
              />
            </AppBlockButton>
            <AppBlockButton onPress={onSave} style={styles.buttonSave}>
              {isRememberLogin ? <IconCheckBox /> : <IconUnCheckBox />}

              <AppText ml={s(5)} size={12} weight="500">
                {t('auth.login.saveInfoLogin')}
              </AppText>
            </AppBlockButton>
            <ToastContainer ref={refToast} />
          </View>
          <View>
            <AppButton
              width={SCREEN_WIDTH - s(32)}
              height={vs(45)}
              onPress={onSubmit}
              mt={vs(16)}
              disabledStyle={{ backgroundColor: Colors.BUTTON_DISABLED }}
              disabled={disabled}
              primary
              textColor={disabled ? Colors.TEXT_DEFAULT : Colors.WHITE}
              processing={processing}
              textStyle={styles.textStyleButton}
              text={t('auth.login.login')}
            />
            <AppBlockButton onPress={onForgotPassword} style={styles.buttonForgotPassword}>
              <AppText size={12} weight="500">
                {t('auth.login.forgotPassword')}
              </AppText>
            </AppBlockButton>
          </View>
        </View>
      </ViewContainer>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  imageBackground: {
    width: SCREEN_WIDTH,
    aspectRatio: 375 / 186,
    marginBottom: vs(24),
    justifyContent: 'center',
    paddingHorizontal: PaddingHorizontal,
  },
  textStyleButton: { fontWeight: '700', fontSize: getFontSize(14) },
  buttonForgotPassword: {
    padding: vs(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSave: {
    width: SCREEN_WIDTH - PaddingHorizontal * 2,
    paddingVertical: vs(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelUser: { fontSize: getFontSize(14), fontWeight: '700' },
  labelPassword: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
  },
  inputStyle: {
    borderWidth: 0,
    width: '100%',
    height: vs(40),
    borderRadius: vs(6),
    backgroundColor: light.backgroundTextInput,
  },
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
});
