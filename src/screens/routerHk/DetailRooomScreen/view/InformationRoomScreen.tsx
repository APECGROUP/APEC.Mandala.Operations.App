import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack } from '@/navigation/RootNavigation';
import { getFontSize } from '@/constants';
import IconArrowTopRight from '@assets/icon/IconArrowTopRight';
import { PaddingHorizontal } from '@/utils/Constans';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'InformationRoomScreen'>;

const InformationRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const translateY = useSharedValue(500);

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 200,
    });
  }, [translateY]);

  const onClose = useCallback(
    (func: () => void) => {
      translateY.value = withTiming(
        500,
        {
          duration: 200,
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

  const onSeeDetail = useCallback(() => {
    navigation.replace('DetailRoomScreen', { id });
  }, [navigation, id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const renderMainButton = (title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.mainButton} onPress={onPress}>
      <AppText style={styles.mainButtonText}>{title}</AppText>
      <IconArrowTopRight />
    </TouchableOpacity>
  );

  return (
    <ViewContainer>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onGoBack}>
        <Animated.View
          style={[
            styles.container,
            {
              paddingBottom: bottom,
            },
            animatedStyle,
          ]}>
          <View style={styles.header}>
            <AppText style={styles.title}>Phòng: {id}</AppText>
            <TouchableOpacity onPress={onGoBack} style={{ paddingHorizontal: PaddingHorizontal }}>
              <IconClose />
            </TouchableOpacity>
          </View>

          <AppText color={'#8F8F8F'} mv={8} pl={16}>
            Chọn một trong các chức năng dưới đây
          </AppText>

          {renderMainButton('XEM CHI TIẾT', onSeeDetail)}
          {renderMainButton('XÁC NHẬN CHECK OUT', () => {})}

          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.section}>
            <AppText style={styles.sectionTitle}>THAY ĐỔI TRẠNG THÁI ĐƠN PHÒNG</AppText>
            <View style={styles.statusContainer}>
              <TouchableOpacity style={[styles.statusButton, { backgroundColor: '#FF3B30' }]}>
                <AppText style={[styles.statusText, { color: 'white' }]}>Dirty</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statusButton, { backgroundColor: '#F2F2F2' }]}>
                <AppText style={[styles.statusText, { color: '#007AFF' }]}>Clean</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statusButton, { backgroundColor: '#F2F2F2' }]}>
                <AppText style={[styles.statusText, { color: '#34C759' }]}>Inspected</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statusButton, { backgroundColor: '#F2F2F2' }]}>
                <AppText style={[styles.statusText, { color: '#FF9500' }]}>Pick - up</AppText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <AppText style={styles.sectionTitle}>CHỨC NĂNG</AppText>
            <View style={styles.functionContainer}>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Post Minibar</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Đổ vỏ</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Khóa phòng</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Đổ thất lạc</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default InformationRoomScreen;

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
    paddingVertical: s(16),
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
