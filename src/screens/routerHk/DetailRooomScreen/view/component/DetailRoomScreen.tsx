import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import { MainParams } from '@/navigation/params';
import light from '@/theme/light';
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';
import { goBack } from '@/navigation/RootNavigation';
import IconBack from '@assets/icon/IconBack';
import { PaddingHorizontal } from '@/utils/Constans';
import IconBuilding from '@assets/icon/IconBuilding';
import IconClear from '@assets/icon/IconClear';
import IconStar from '@assets/icon/IconStar';
import IconFloor from '@assets/icon/IconFloor';
import RoomInfoRow from './RoomInfoRow';
import { ROOM_STATUSES } from './constants';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'DetailRoomScreen'>;

const DetailRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
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

  // Helper to get status info (for demo, hardcoded to 'Dirty')
  const status = ROOM_STATUSES[0]; // Replace with real status if available

  // Style cho các view động
  const statusViewStyle = [styles.statusView, { backgroundColor: status.color }];
  const headerLeftStyle = styles.headerLeft;

  return (
    <ViewContainer>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onGoBack}>
        <AnimatedButton
          activeOpacity={1}
          onPress={() => {}}
          style={[
            styles.container,
            {
              paddingBottom: bottom + vs(10),
            },
            animatedStyle,
          ]}>
          <View style={styles.header}>
            <View style={headerLeftStyle}>
              <AppBlockButton style={{ padding: PaddingHorizontal }} onPress={onInformation}>
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

          {/* Room Info Rows */}
          <RoomInfoRow icon={<IconBuilding />} label="Toà nhà" value="Toà Diamond" />
          <RoomInfoRow icon={<IconStar />} label="Hạng phòng" value="Deluxe" />
          <RoomInfoRow icon={<IconFloor />} label="Tầng" value="Tầng 1" />
          <RoomInfoRow
            icon={<IconClear fill={'#0D0D0D'} />}
            label="Trạng thái dọn phòng"
            value={
              <View style={statusViewStyle}>
                <AppText weight="600" color={'#fff'}>
                  {status.name}
                </AppText>
              </View>
            }
          />
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusView: {
    height: vs(30),
    justifyContent: 'center',
    borderRadius: 100,
    paddingHorizontal: s(10),
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
