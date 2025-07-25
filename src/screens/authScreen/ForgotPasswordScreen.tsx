import { Keyboard, StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthParams } from '../../navigation/params';
import { Colors } from '@/theme/Config';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { useAuthViewModel } from './viewmodel/AuthViewModel';
import { useAlert } from '@/elements/alert/AlertProvider';

const ForgotPasswordScreen = ({
  navigation,
}: NativeStackScreenProps<AuthParams, 'ForgotPasswordScreen'>) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { showToast } = useAlert();
  const { forgotPasswordForm, processing, setForgotPasswordForm, forgotPassword } =
    useAuthViewModel();

  const { userName, hotel } = forgotPasswordForm;
  const disabled = !userName || !hotel.id;

  const onBlurUserName = () => {
    if (!userName.trim()) {
      showToast(t('auth.login.emptyUserName'), TYPE_TOAST.ERROR);
    }
  };

  const onPickHotel = () => {
    Keyboard.dismiss();
    navigation.navigate('ModalPickHotel');
  };

  return (
    <ViewContainer>
      <View style={[styles.container, { paddingBottom: bottom }]}>
        <StatusBar barStyle="default" backgroundColor="white" />

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
            onBlur={onBlurUserName}
            onChangeText={text => setForgotPasswordForm({ userName: text })}
            onSubmitEditing={onPickHotel}
            placeholder={t('auth.forgotPassword.inputUserName')}
          />
          <AppBlockButton onPress={onPickHotel}>
            <AppTextInput
              required
              editable={false}
              labelStyle={styles.labelPassword}
              label={t('auth.forgotPassword.hotel')}
              placeholderTextColor={light.placeholderTextColor}
              noBorder
              value={hotel?.name?.toString()}
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
          </AppBlockButton>
        </AppBlock>
        <AppButton
          width={SCREEN_WIDTH - s(32)}
          height={vs(45)}
          onPress={forgotPassword}
          disabledStyle={{ backgroundColor: Colors.BUTTON_DISABLED }}
          disabled={disabled}
          primary
          textColor={disabled ? Colors.TEXT_DEFAULT : Colors.WHITE}
          processing={processing}
          textStyle={styles.textStyleButton}
          text={t('auth.forgotPassword.confirm')}
          style={{ marginTop: vs(32) }}
        />
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
