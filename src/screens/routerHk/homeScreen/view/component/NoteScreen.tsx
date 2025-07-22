import React, { useCallback } from 'react';
import { TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import light from '@/theme/light';
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack } from '@/navigation/RootNavigation';
import { PaddingHorizontal } from '@/utils/Constans';
import IconClear from '@assets/icon/IconClear';
import IconCheckInAndCheckOut from '@assets/icon/IconCheckInAndCheckOut';
import IconCheckIn from '@assets/icon/IconCheckIn';
import IconCheckOut from '@assets/icon/IconCheckOut';
import IconLock from '@assets/icon/IconLock';
import IconFlag from '@assets/icon/IconFlag';

moment.locale('vi');

const CLEANING_STATUSES = [
  { label: 'Clean', icon: <IconClear /> },
  { label: 'Inspected', icon: <IconClear fill={'#44921F'} /> },
  { label: 'Pickup', icon: <IconClear fill="#FDB229" /> },
  { label: 'Dirty', icon: <IconClear fill={'#D8070B'} /> },
];

const ROOM_STATUSES = [
  { label: 'Đặt phòng', color: '#44921F' },
  { label: 'Phòng trống', color: '#1D7AFC' },
  { label: 'Có người', color: '#FDB229' },
];

const GUEST_STATUSES = [
  { label: 'Có khách check out & check in', icon: <IconCheckInAndCheckOut /> },
  { label: 'Có khách check in', icon: <IconCheckIn /> },
  { label: 'Có khách check out', icon: <IconCheckOut /> },
];

const LOCK_STATUS = { label: 'Phòng khóa', icon: <IconLock /> };
const FLAG_STATUS = { label: 'Phòng chờ check out', icon: <IconFlag /> };

const StatusItemTop = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <View style={styles.statusItem50}>
    {icon}
    <AppText ml={8}>{label}</AppText>
  </View>
);
const StatusItem = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <View style={styles.statusItem}>
    {icon}
    <AppText ml={8}>{label}</AppText>
  </View>
);

const RoomStatusItem = ({ label, color }: { label: string; color: string }) => (
  <View style={styles.statusItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <AppText ml={8}>{label}</AppText>
  </View>
);

const NoteScreen = () => {
  const { bottom } = useSafeAreaInsets();

  const translateY = useSharedValue(1000);

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 300,
    });
  }, [translateY]);

  const onClose = useCallback(
    (func: () => void) => {
      translateY.value = withTiming(
        1000,
        {
          duration: 300,
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ViewContainer>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onGoBack}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.container,
              {
                paddingBottom: bottom + vs(10),
              },
              animatedStyle,
            ]}>
            <View style={styles.header}>
              <AppText size={20} weight="bold" textAlign="center">
                Chú thích
              </AppText>
              <AppBlockButton onPress={onGoBack} style={{ padding: vs(16) }}>
                <IconClose />
              </AppBlockButton>
            </View>

            {/* 1. Trạng thái dọn phòng của HK */}
            <View style={[styles.contentContainer, { paddingTop: vs(0) }]}>
              <AppText weight="600" mt={8} mb={4}>
                1. Trạng thái dọn phòng của HK
              </AppText>
              <View style={styles.statusesContainer}>
                {CLEANING_STATUSES.map(status => (
                  <StatusItemTop key={status.label} label={status.label} icon={status.icon} />
                ))}
              </View>
            </View>
            {/* 2. Trạng thái phòng */}
            <View style={styles.contentContainer}>
              <AppText weight="600" mt={8} mb={4}>
                2. Trạng thái phòng
              </AppText>
              <View style={[styles.statusesContainer, styles.justifyContent]}>
                {ROOM_STATUSES.map(status => (
                  <RoomStatusItem key={status.label} label={status.label} color={status.color} />
                ))}
              </View>
            </View>
            {/* 3. Trạng thái của phòng theo khách */}
            <View style={styles.contentContainer}>
              <AppText weight="600" mt={8} mb={4}>
                3. Trạng thái của phòng theo khách
              </AppText>
              <View style={styles.statusesColumn}>
                {GUEST_STATUSES.map(status => (
                  <StatusItem key={status.label} label={status.label} icon={status.icon} />
                ))}
              </View>
            </View>
            {/* 4. Trạng thái khoá */}
            <View style={styles.contentContainer}>
              <AppText weight="600" mt={8} mb={4}>
                4. Trạng thái khoá
              </AppText>
              <View style={styles.statusesColumn}>
                <StatusItem label={LOCK_STATUS.label} icon={LOCK_STATUS.icon} />
              </View>
            </View>
            {/* 5. Trạng thái chờ check out */}
            <View style={[styles.contentContainer, styles.noBorder]}>
              <AppText weight="600" mt={8} mb={4}>
                5. Trạng thái chờ check out
              </AppText>
              <View style={styles.statusesColumn}>
                <StatusItem label={FLAG_STATUS.label} icon={FLAG_STATUS.icon} />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default NoteScreen;

const styles = ScaledSheet.create({
  justifyContent: { justifyContent: 'space-between' },
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
    paddingLeft: PaddingHorizontal,
  },
  contentContainer: {
    paddingHorizontal: PaddingHorizontal,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    paddingVertical: vs(12),
  },
  statusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingHorizontal,
  },
  statusesColumn: {
    flexDirection: 'column',
    paddingLeft: PaddingHorizontal,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  statusItem50: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    width: '50%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
});
