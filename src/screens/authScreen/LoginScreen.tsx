import { ImageBackground, Keyboard, StyleSheet, TextInput, View, StatusBar } from 'react-native';
import React, { useRef, useEffect } from 'react';
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
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import Images from '@assets/image/Images';
import { useTranslation } from 'react-i18next';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAutoLogin } from '@/hook/useAutoLogin';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { useAuthViewModel } from './viewmodel/AuthViewModel';
import { IDataListHotel } from '@/views/modal/modalPickHotel/modal/PickHotelModal';

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
  const refToast = useRef<any>(null);
  const refPassword = useRef<TextInput>(null);
  const { credentials, loading: loadingCredentials } = useAutoLogin();
  const { bottom } = useSafeAreaInsets();

  const { loginForm, processing, setLoginForm, login, toggleRememberLogin } = useAuthViewModel();

  const { userName, password, hotel, isRememberLogin } = loginForm;

  // Tự động điền thông tin đăng nhập nếu có
  useEffect(() => {
    if (credentials && !loadingCredentials) {
      console.log('chạy lại');
      setLoginForm({
        userName: credentials.username,
        password: credentials.password,
        hotel: credentials.hotel,
        isRememberLogin: true,
      });
    }
  }, [credentials, loadingCredentials, setLoginForm]);

  const disabled = !userName || !password || !hotel?.code;

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
    navigation.navigate('ModalPickHotel', {
      hotel: hotel,
      setHotel: (newHotel: IDataListHotel | undefined) => setLoginForm({ hotel: newHotel }),
    });
  };

  const onForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };
  console.log('render màn hình login');
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

            <AppTextInput
              required
              labelStyle={styles.labelUser}
              label={t('auth.login.userName')}
              placeholderTextColor={light.placeholderTextColor}
              value={userName}
              maxLength={20}
              onChangeText={text => setLoginForm({ userName: text })}
              onBlur={onBlurUserName}
              placeholder={t('auth.login.inputUserName')}
              // returnKeyType="next"
              // keyboardType="number-pad"
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
              onChangeText={text => setLoginForm({ password: text })}
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
                inputStyle={styles.inputStyle}
                containerStyle={{
                  width: SCREEN_WIDTH - PaddingHorizontal * 2,
                }}
              />
            </AppBlockButton>
            <AppBlockButton onPress={toggleRememberLogin} style={styles.buttonSave}>
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
              onPress={login}
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
    alignItems: 'center',
  },
});
