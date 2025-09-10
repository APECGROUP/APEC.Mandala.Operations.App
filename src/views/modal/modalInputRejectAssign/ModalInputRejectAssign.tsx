import React, { useCallback } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { AppText } from '@/elements/text/AppText';
import { MainParams } from '@/navigation/params';
import light from '@/theme/light';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack } from '@/navigation/RootNavigation';
import { getFontSize } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import AppTextInput from '@/elements/textInput/AppTextInput';
import { Colors } from '@/theme/Config';
import { AppButton } from '@/elements/button/AppButton';
import { useInformationItemsViewModel } from '@/screens/InformationItemScreen/viewmodal/useInformationItemsViewModel';
import { isAndroid } from '@/utils/Utilities';
import { useAssignPriceViewModel } from '@/screens/assignPriceScreen/viewmodal/useAssignPriceViewModel';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'ModalInputRejectAssign'>;

const ModalInputRejectAssign = ({ route }: Props) => {
  const { id, prNo } = route.params;
  const { onReject, isLoadingConfirm, textReason, setTextReason, isDisableButtonReject } =
    useInformationItemsViewModel(id, prNo);
  const { t } = useTranslation();

  const translateY = useSharedValue(800);
  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 200,
    });
  }, [translateY]);

  const onClose = useCallback(
    (func?: () => void) => {
      translateY.value = withTiming(
        800,
        {
          duration: 200,
        },
        finished => {
          if (finished && func) {
            runOnJS(func)();
          }
        },
      );
    },
    [translateY],
  );
  const { onRefresh } = useAssignPriceViewModel();
  const onGoBack = useCallback(() => {
    onClose(goBack);
  }, [onClose]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const onGoBackAndRefetch = useCallback(() => {
    onGoBack();
    onRefresh();
  }, [onGoBack, onRefresh]);
  const onConfirm = useCallback(() => {
    onReject(onGoBackAndRefetch);
  }, [onGoBackAndRefetch, onReject]);

  return (
    <ViewContainer>
      <KeyboardAvoidingView behavior={isAndroid() ? 'height' : 'padding'} style={styles.overlay}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <AppText size={18} weight="700" alignSelf="center" mb={16}>
            {t('assignPrice.rejectAssign')}
          </AppText>
          <AppTextInput
            maxLength={255}
            required
            multiline
            value={textReason}
            onChangeText={setTextReason}
            noBorder={true}
            inputStyle={styles.inputStyle}
            label={t('assignPrice.reason')}
            placeholder={t('assignPrice.inputReason')}
          />
          <View style={styles.actionButtonsContainer}>
            <View style={styles.blockButton}>
              <AppButton width={s(150)} onPress={onGoBack} style={styles.rejectButton}>
                <AppText size={14} weight="700">
                  {t('assignPrice.close')}
                </AppText>
              </AppButton>
            </View>
            <View style={styles.blockButton}>
              <AppButton
                width={s(150)}
                onPress={onConfirm}
                disabled={isDisableButtonReject}
                processing={isLoadingConfirm}
                disabledStyle={{ backgroundColor: Colors.COLOR_CLOSE }}
                style={styles.buttonAssign}>
                <AppText
                  color={isDisableButtonReject ? Colors.TEXT_DEFAULT : Colors.WHITE}
                  size={14}
                  weight="700">
                  {t('assignPrice.confirm')}
                </AppText>
              </AppButton>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ViewContainer>
  );
};

export default ModalInputRejectAssign;

const styles = ScaledSheet.create({
  inputStyle: {
    borderWidth: 0,
    height: vs(120),
    marginBottom: vs(16),
    paddingTop: vs(8),
    backgroundColor: Colors.BLACK_100,
  },
  buttonAssign: {
    width: s(150),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.ERROR_600,
    borderRadius: s(8),
  },
  blockButton: { width: s(150), alignItems: 'center' },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    width: s(150),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.COLOR_CLOSE,
    borderRadius: s(8),
  },

  overlay: {
    paddingHorizontal: PaddingHorizontal,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: light.white,
    borderRadius: s(16),
    padding: s(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: PaddingHorizontal,
  },
  title: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#0D0D0D',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: vs(20),
  },
  mainButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingHorizontal: PaddingHorizontal,
  },
  mainButtonText: {
    fontWeight: '600',
  },
  arrowContainer: {
    width: s(20),
    height: s(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
  },
  section: {
    marginTop: vs(20),
    paddingHorizontal: PaddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingBottom: vs(8),
  },
  sectionTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: vs(12),
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -s(4),
  },
  statusButton: {
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
    borderRadius: s(16),
    marginHorizontal: s(4),
    marginBottom: vs(8),
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  functionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -s(4),
  },
  functionButton: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    backgroundColor: '#F2F2F2',
    borderRadius: s(16),
    marginHorizontal: s(4),
    marginBottom: vs(8),
  },
  functionText: {
    fontSize: 14,
    color: '#000',
  },
});
