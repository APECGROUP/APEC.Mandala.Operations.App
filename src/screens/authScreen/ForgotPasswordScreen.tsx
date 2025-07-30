// screens/authScreen/ForgotPasswordScreen.tsx
import { Keyboard, StatusBar, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { useAuthViewModel } from './viewmodel/AuthViewModel';
import { IDataListHotel } from '@/views/modal/modalPickHotel/modal/PickHotelModal';

const ForgotPasswordScreen = ({
  navigation,
}: NativeStackScreenProps<AuthParams, 'ForgotPasswordScreen'>) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const {
    forgotPasswordForm,
    processing,
    setForgotPasswordForm,
    forgotPassword,
    handleBlurForgotPasswordUserName,
  } = useAuthViewModel();

  const { userName, hotel } = forgotPasswordForm;
  const disabled = !userName || !hotel?.code;

  const onPickHotel = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate('ModalPickHotel', {
      hotel: hotel,
      setHotel: (newHotel: IDataListHotel | undefined) =>
        setForgotPasswordForm({ hotel: newHotel }),
    });
  }, [navigation, hotel, setForgotPasswordForm]);

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
            containerStyle={styles.userNameInputContainer}
            label={t('auth.forgotPassword.userName')}
            value={userName}
            maxLength={20}
            inputStyle={styles.inputStyle}
            onBlur={handleBlurForgotPasswordUserName} // Gọi hàm onBlur từ ViewModel
            onChangeText={text => setForgotPasswordForm({ userName: text })} // Chỉ cập nhật useRef, không re-render
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
              rightIcon={<IconArrowRight stroke="#D8D8D8" style={styles.hotelArrowIcon} />}
              inputStyle={styles.inputStyle}
              containerStyle={styles.hotelInputContainer}
            />
          </AppBlockButton>
        </AppBlock>
        <AppButton
          width={SCREEN_WIDTH - s(32)}
          height={vs(45)}
          onPress={forgotPassword}
          disabledStyle={styles.disabledButton}
          disabled={disabled}
          primary
          textColor={disabled ? Colors.TEXT_DEFAULT : Colors.WHITE}
          processing={processing}
          textStyle={styles.textStyleButton}
          text={t('auth.forgotPassword.confirm')}
          style={styles.confirmButton}
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
    alignItems: 'center',
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
  userNameInputContainer: {
    marginBottom: vs(16),
    marginTop: vs(32),
    width: SCREEN_WIDTH - PaddingHorizontal * 2,
  },
  hotelInputContainer: {
    width: SCREEN_WIDTH - PaddingHorizontal * 2,
  },
  hotelArrowIcon: {
    transform: [{ rotate: '90deg' }],
  },
  disabledButton: {
    backgroundColor: Colors.BUTTON_DISABLED,
  },
  confirmButton: {
    marginTop: vs(32),
  },
});
