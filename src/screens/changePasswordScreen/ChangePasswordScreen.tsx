import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainParams} from '../../navigation/params';
import {useTranslation} from 'react-i18next';
import {s, vs} from 'react-native-size-matters';
import {Colors} from '@/theme/Config';
import {PaddingHorizontal} from '@/utils/Constans';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {FadeInDown, SlideInDown} from 'react-native-reanimated';
import {AppText} from '@/elements/text/AppText';
import AppTextInput from '@/elements/textInput/AppTextInput';
import {AppButton} from '@/elements/button/AppButton';
import {getFontSize, SCREEN_WIDTH} from '@/constants';
import IconClose from '@assets/icon/IconClose';
import {useKeyboard} from '@/hook/keyboardHook';

type Props = NativeStackScreenProps<MainParams, 'ChangePasswordScreen'>;

const ChangePasswordScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const {keyboardHeight, keyboardVisible} = useKeyboard();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState<boolean | undefined>(false);

  const refCurrent = useRef(null);
  const refNew = useRef(null);
  const refConfirm = useRef(null);

  const disabled =
    !currentPassword || !confirmPassword || newPassword !== confirmPassword;

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSubmit = async () => {
    try {
      setProcessing(true);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessing(false);
      await new Promise(resolve => setTimeout(resolve, 1000));
      goBack();
    } catch (error) {
      console.log(error);
    } finally {
    }
    // Gọi API đổi mật khẩu hoặc xử lý xác thực tại đây
  };

  return (
    <View style={[styles.overlay]}>
      <Animated.View
        // entering={SlideInDown.springify().mass(0.5)}
        entering={FadeInDown.delay(0).duration(0).springify()}
        style={[
          styles.container,
          {paddingBottom: bottom},
          keyboardVisible && {marginBottom: keyboardHeight},
        ]}>
        <View style={styles.header}>
          <AppText size={16} weight="700">
            {t('account.changePassword.title')}
          </AppText>
          <TouchableOpacity style={{padding: s(20)}} onPress={goBack}>
            <IconClose />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: PaddingHorizontal}}>
          <AppTextInput
            refName={refCurrent}
            label={t('account.changePassword.currentPassword')}
            labelStyle={styles.labelPassword}
            placeholder={t('account.changePassword.inputCurrentPassword')}
            value={currentPassword}
            secureTextEntry
            onChangeText={setCurrentPassword}
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
            onChangeText={setNewPassword}
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
            disabledStyle={{backgroundColor: Colors.BUTTON_DISABLED}}
            disabled={disabled}
            primary
            textColor={disabled ? Colors.TEXT_DEFAULT : Colors.WHITE}
            processing={processing}
            textStyle={styles.textStyleButton}
            text={t('account.changePassword.confirm')}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  textStyleButton: {fontWeight: '700', fontSize: getFontSize(14)},

  labelPassword: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  header: {
    paddingLeft: PaddingHorizontal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
    borderBottomColor: Colors.BLACK_100,
    borderBottomWidth: 0.5,
  },
  input: {
    borderWidth: 0,
    width: '100%',
    height: vs(40),
    borderRadius: vs(6),
    backgroundColor: Colors.BLACK_100,
    marginBottom: vs(16),
  },
  confirmButton: {
    marginTop: vs(8),
    backgroundColor: Colors.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: vs(14),
  },
});
