import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { AppText } from '@/elements/text/AppText';
import { MainParams } from '@/navigation/params';
import light from '@/theme/light';
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack } from '@/navigation/RootNavigation';
import { getFontSize } from '@/constants';
import IconArrowTopRight from '@assets/icon/IconArrowTopRight';
import { PaddingHorizontal } from '@/utils/Constans';
import RenderStatusComponent from './component/RenderStatusComponent';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'InformationRoomScreen'>;

const InformationRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
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

          <RenderStatusComponent onGoBack={onGoBack} id={id} />

          <TouchableOpacity activeOpacity={1} style={[styles.section]} onPress={() => {}}>
            <AppText style={styles.sectionTitle}>CHỨC NĂNG</AppText>
            <View style={styles.functionContainer}>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Post Minibar</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Đổ vỡ</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Khóa phòng</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Đổ thất lạc</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <AppText style={styles.functionText}>Post giặt là</AppText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </AnimatedButton>
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
    paddingBottom: vs(8),
  },
  sectionTitle: {
    marginBottom: vs(12),
    fontWeight: '600',
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
    marginHorizontal: -s(8),
  },
  functionButton: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: s(16),
  },
  functionText: {
    color: '#44921F',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
