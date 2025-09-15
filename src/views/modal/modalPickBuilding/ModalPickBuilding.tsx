import React, { useCallback, useState } from 'react';
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
import { PaddingHorizontal } from '@/utils/Constans';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { Colors } from '@/theme/Config';
import { AppButton } from '@/elements/button/AppButton';
import { AppBlock } from '@/elements/block/Block';

moment.locale('vi');
const fakeDataBuilding = [
  { name: 'A', id: 'A' },
  { name: 'B', id: 'B' },
  { name: 'C', id: 'C' },
  { name: 'D', id: 'D' },
  { name: 'E', id: 'E' },
];
type Props = NativeStackScreenProps<MainParams, 'ModalPickBuilding'>;

const ModalPickBuilding = ({ route }: Props) => {
  const { building, setBuilding } = route.params;
  const [selectedBuilding, setSelectedBuilding] = useState(building);
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
  const onSubmit = useCallback(() => {
    setBuilding(selectedBuilding);
    onClose(goBack);
  }, [onClose, selectedBuilding, setBuilding]);

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
            <AppText style={styles.title}>Chọn tòa</AppText>
            <TouchableOpacity onPress={onGoBack} style={{ paddingHorizontal: PaddingHorizontal }}>
              <IconClose />
            </TouchableOpacity>
          </View>
          <AppBlock pv={16}>
            {fakeDataBuilding.map(item => {
              const isSelected = selectedBuilding?.id === item.id;
              return (
                <AppBlockButton
                  onPress={() => setSelectedBuilding(item)}
                  style={[
                    {
                      paddingVertical: vs(8),
                      paddingHorizontal: s(12),
                      marginHorizontal: PaddingHorizontal,
                    },
                    isSelected && { backgroundColor: Colors.PRIMARYLIGHT },
                  ]}
                  key={item.id}>
                  <AppText weight="600">{item.name}</AppText>
                </AppBlockButton>
              );
            })}
          </AppBlock>
          <AppButton onPress={onSubmit} style={styles.center} text="Xác nhận" primary />
        </AnimatedButton>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default ModalPickBuilding;

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
  center: { alignSelf: 'center' },
});
