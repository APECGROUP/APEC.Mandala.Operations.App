import { Keyboard, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import light from '../../theme/light';
import { s, vs } from 'react-native-size-matters';
import { AppText } from '../../elements/text/AppText';
import { useTranslation } from 'react-i18next';
import { getFontSize, SCREEN_WIDTH } from '../../constants';
import AppTextInput from '../../elements/textInput/AppTextInput';
import { AppBlock } from '../../elements/block/Block';
import { AppButton } from '../../elements/button/AppButton';
import IconArrowRight from '../../../assets/icon/IconArrowRight';
import { PaddingHorizontal } from '../../utils/Constans';
import { typeHotel } from './LoginScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthParams } from '../../navigation/params';
import { Colors } from '@/theme/Config';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useAlert } from '@/elements/alert/AlertProvider';
import { goBack } from '@/navigation/RootNavigation';
import DeviceInfo from 'react-native-device-info';
import api from '@/utils/setup-axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

const ForgotPasswordScreen = ({
  navigation,
}: NativeStackScreenProps<AuthParams, 'ForgotPasswordScreen'>) => {
  const { t } = useTranslation();
  const { showToast, showAlert } = useAlert();
  const [userName, setUserName] = useState('');
  const [processing, setProcessing] = useState<boolean | undefined>(false);
  const [hotel, setHotel] = useState<typeHotel>({} as typeHotel);
  const { bottom } = useSafeAreaInsets();
  const disabled = !userName || !hotel.id;
  const onPickHotel = () => {
    Keyboard.dismiss();
    navigation.navigate('ModalPickHotel', { hotel, setHotel });
  };

  const onSubmit = async () => {
    if (userName.toLocaleLowerCase() === 'tuan') {
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
    return showToast(t('auth.forgotPassword.error'), TYPE_TOAST.ERROR);

    // eslint-disable-next-line no-unreachable
    try {
      setProcessing(true);

      const body = {
        email: userName,
        deviceId: DeviceInfo.getDeviceId(),
        deviceName:
          typeof DeviceInfo.getDeviceName() === 'string' ? DeviceInfo.getDeviceName() : 'simulator',
        deviceInfo: DeviceInfo.getSystemVersion(),
      };

      const resp = await api.post('user/check-login', body, { noAuth: true });
      setProcessing(false);

      if (resp.status !== 200) {
        throw new Error();
      }
    } catch (err: any) {
      setProcessing(false);
      // refToast.current?.show(t('auth.login.loginError'), TYPE_TOAST.ERROR);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <ViewContainer>
      <View style={[styles.container, { paddingBottom: bottom }]}>
        <AppBlock>
          <AppText size={20} weight="700">
            {t('auth.forgotPassword.title')}
          </AppText>
          <AppText size={12} weight="500" color={'#727272'} mt={vs(8)}>
            {t('auth.forgotPassword.subtitle')}
          </AppText>

          <AppTextInput
            required
            labelStyle={styles.labelPassword}
            containerStyle={styles.bottom10}
            label={t('auth.forgotPassword.userName')}
            value={userName}
            maxLength={20}
            inputStyle={styles.inputStyle}
            onChangeText={setUserName}
            onSubmitEditing={onPickHotel}
            placeholder={t('auth.forgotPassword.inputUserName')}
          />
          <AppTextInput
            required
            editable={false}
            labelStyle={styles.labelPassword}
            label={t('auth.forgotPassword.hotel')}
            placeholderTextColor={light.placeholderTextColor}
            noBorder
            maxLength={20}
            value={hotel?.name}
            placeholder={t('auth.forgotPassword.pickHotel')}
            rightIcon={
              <IconArrowRight stroke="#D8D8D8" style={{ transform: [{ rotate: '90deg' }] }} />
            }
            onPress={onPickHotel}
            inputStyle={styles.inputStyle}
            containerStyle={{
              width: SCREEN_WIDTH - PaddingHorizontal * 2,
            }}
          />
        </AppBlock>
        <View>
          <AppButton
            width={SCREEN_WIDTH - s(32)}
            height={vs(45)}
            onPress={onSubmit}
            disabledStyle={{ backgroundColor: Colors.BUTTON_DISABLED }}
            disabled={disabled}
            primary
            textColor={disabled ? Colors.TEXT_DEFAULT : Colors.WHITE}
            processing={processing}
            textStyle={styles.textStyleButton}
            text={t('auth.forgotPassword.confirm')}
          />
        </View>
      </View>
    </ViewContainer>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  textStyleButton: { fontWeight: '700', fontSize: getFontSize(14) },

  container: {
    flex: 1,
    backgroundColor: light.white,
    paddingTop: vs(16),
    justifyContent: 'space-between',
  },
  labelPassword: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    marginTop: vs(0),
  },
  inputStyle: {
    borderWidth: 0,
    width: '100%',
    height: vs(40),
    borderRadius: vs(6),
    backgroundColor: light.backgroundTextInput,
  },
  bottom10: {
    marginBottom: vs(16),
    marginTop: vs(32),
  },
});
