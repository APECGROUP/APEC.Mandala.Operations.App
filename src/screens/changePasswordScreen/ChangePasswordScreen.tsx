import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '../../navigation/params';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';
import { Colors } from '@/theme/Config';
import { PaddingHorizontal } from '@/utils/Constans';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/elements/text/AppText';
import AppTextInput from '@/elements/textInput/AppTextInput';
import { AppButton } from '@/elements/button/AppButton';
import { getFontSize, SCREEN_WIDTH } from '@/constants';
import { useKeyboard } from '@/hook/keyboardHook';
import DataLocal from '@/data/DataLocal';
import { useAutoLogin } from '@/hook/useAutoLogin';
import Toast from 'react-native-toast-message';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

type Props = NativeStackScreenProps<MainParams, 'ChangePasswordScreen'>;

const ChangePasswordScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { keyboardHeight, keyboardVisible } = useKeyboard();
  const { credentials } = useAutoLogin();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState<boolean | undefined>(false);

  const refCurrent = useRef<TextInput>(null);
  const refNew = useRef<TextInput>(null);
  const refConfirm = useRef<TextInput>(null);

  const disabled = !currentPassword || !confirmPassword || newPassword !== confirmPassword;

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSubmit = async () => {
    try {
      setProcessing(true);

      // Kiểm tra mật khẩu hiện tại có đúng không
      if (credentials && currentPassword !== credentials.password) {
        Toast.show({
          type: 'error',
          text2: t('account.changePassword.currentPasswordNotMatch'),
        });
        setProcessing(false);
        return;
      }

      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

      // Cập nhật mật khẩu mới vào Keychain
      if (credentials) {
        await DataLocal.saveCredentials(credentials.username, newPassword, credentials.hotel);
        Toast.show({
          type: 'success',
          text2: t('account.changePassword.changePasswordSuccess'),
        });
      }

      setProcessing(false);
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      goBack();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text2: t('account.changePassword.changePasswordFail'),
      });
      setProcessing(false);
    }
    // Gọi API đổi mật khẩu hoặc xử lý xác thực tại đây
  };

  return (
    <ViewContainer>
      <View
        style={[
          styles.container,
          { paddingBottom: bottom },
          keyboardVisible && { marginBottom: keyboardHeight },
        ]}>
        <AppText ph={16} mb={8} size={20} weight="700">
          {t('account.changePassword.title')}
        </AppText>
        <AppText ph={16} mb={16} size={12} weight="500" color={Colors.TEXT_SECONDARY}>
          {t('account.changePassword.inputEmail')}
        </AppText>
        <View style={{ paddingHorizontal: PaddingHorizontal }}>
          <AppTextInput
            refName={refCurrent}
            label={t('account.changePassword.currentPassword')}
            labelStyle={styles.labelPassword}
            placeholder={t('account.changePassword.inputCurrentPassword')}
            value={currentPassword}
            secureTextEntry
            maxLength={20}
            onChangeText={setCurrentPassword}
            onSubmitEditing={() => refNew.current?.focus()}
            inputStyle={styles.input}
            containerStyle={{
              width: SCREEN_WIDTH - PaddingHorizontal * 2,
            }}
          />

          <AppTextInput
            refName={refNew}
            label={t('account.changePassword.newPassword')}
            labelStyle={styles.labelPassword}
            placeholder={t('account.changePassword.inputNewPassword')}
            value={newPassword}
            secureTextEntry
            maxLength={20}
            onChangeText={setNewPassword}
            onSubmitEditing={() => refConfirm.current?.focus()}
            inputStyle={styles.input}
            containerStyle={{
              width: SCREEN_WIDTH - PaddingHorizontal * 2,
            }}
          />

          <AppTextInput
            refName={refConfirm}
            label={t('account.changePassword.confirmPassword')}
            labelStyle={styles.labelPassword}
            placeholder={t('account.changePassword.inputConfirmPassword')}
            value={confirmPassword}
            secureTextEntry
            maxLength={20}
            onChangeText={setConfirmPassword}
            inputStyle={styles.input}
            containerStyle={{
              width: SCREEN_WIDTH - PaddingHorizontal * 2,
            }}
          />

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
            text={t('account.changePassword.confirm')}
          />
        </View>
      </View>
    </ViewContainer>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  textStyleButton: { fontWeight: '700', fontSize: getFontSize(14) },

  labelPassword: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  container: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  input: {
    borderWidth: 0,
    width: '100%',
    height: vs(40),
    borderRadius: vs(6),
    backgroundColor: Colors.BLACK_100,
    marginBottom: vs(16),
  },
});
