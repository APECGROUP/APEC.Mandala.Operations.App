import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import { MainParams } from '@/navigation/params';
import light from '@/theme/light';
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';
import { goBack } from '@/navigation/RootNavigation';
import IconBack from '@assets/icon/IconBack';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'DetailRoomScreen'>;

const DetailRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const translateY = useSharedValue(500);

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 500,
    });
  }, [translateY]);

  const onClose = useCallback(
    (func: () => void) => {
      translateY.value = withTiming(
        500,
        {
          duration: 500,
        },
        finished => {
          if (finished) {
            runOnJS(func)();
          }
        },
      );
    },
    [translateY],
  );

  const onGoBack = useCallback(() => {
    onClose(goBack);
  }, [onClose]);

  const onInformation = useCallback(() => {
    onClose(() => {
      navigation.replace('InformationRoomScreen', { id });
    });
  }, [navigation, id, onClose]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ViewContainer>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onGoBack}>
        <AnimatedButton
          activeOpacity={1}
          onPress={() => {}}
          style={[
            styles.container,
            {
              paddingBottom: bottom,
            },
            animatedStyle,
          ]}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppBlockButton onPress={onInformation}>
                <IconBack />
              </AppBlockButton>
              <AppText size={20} weight="bold" textAlign="center">
                {`Phòng: ${id}`}
              </AppText>
            </View>
            <AppBlockButton onPress={goBack} style={{ padding: vs(16) }}>
              <IconClose />
            </AppBlockButton>
          </View>
          <AppText>Chọn một trong các chức năng dưới đây</AppText>
        </AnimatedButton>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default DetailRoomScreen;

const styles = ScaledSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: light.white,
    borderTopLeftRadius: s(12),
    borderTopRightRadius: s(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: s(16),
    marginBottom: vs(10),
  },
  rangeStart: {
    backgroundColor: '#228b22',
    borderTopLeftRadius: s(100),
    borderBottomLeftRadius: s(100),
  },
  rangeEnd: {
    backgroundColor: '#228b22',
    borderTopRightRadius: s(100),
    borderBottomRightRadius: s(100),
  },
  rangeBetween: {
    backgroundColor: '#d0e8d0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingTop: '12@s',
    paddingHorizontal: s(16),
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#eef2ee',
    padding: '12@vs',
    marginRight: '8@s',
    borderRadius: '8@s',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#228b22',
    padding: '12@vs',
    marginLeft: '8@s',
    borderRadius: '8@s',
    alignItems: 'center',
  },
  resetText: {
    color: '#333',
    fontWeight: '500',
    fontSize: '14@ms',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '14@ms',
  },
});
