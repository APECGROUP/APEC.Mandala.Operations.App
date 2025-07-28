import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { MainParams } from '../../navigation/params';
import { AppText } from '../../elements/text/AppText';
import AppBlockButton from '../button/AppBlockButton';
import IconClose from '../../../assets/icon/IconClose';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import light from '../../theme/light';
import { useTranslation } from 'react-i18next';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'ModalPickCalendar'>;

type ModalPickCalendarParams = {
  isSingleMode?: boolean;
  onSelectDate?: (date: Date | null) => void;
  onSelectRange?: (start: Date | null, end: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  initialDate?: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
};

const ModalPickCalendar = ({ navigation, route }: Props) => {
  const {
    isSingleMode = false,
    onSelectDate,
    onSelectRange,
    initialDate,
    initialStartDate,
    initialEndDate,
    minDate,
    maxDate,
  } = route.params as ModalPickCalendarParams;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const [startDate, setStartDate] = useState<Date | undefined>(
    initialStartDate || initialDate || undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate || undefined);

  const translateY = useSharedValue(500);

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 500,
    });
  }, [translateY]);

  const goBack = useCallback(() => {
    translateY.value = withTiming(
      500,
      {
        duration: 500,
      },
      finished => {
        if (finished) {
          runOnJS(navigation.goBack)();
        }
      },
    );
  }, [navigation, translateY]);

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleSave = () => {
    if (startDate && endDate) {
      onSelectRange?.(startDate, endDate);
      goBack();
    }
  };

  const onDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
    if (isSingleMode) {
      onSelectDate?.(date);
      goBack();
    } else {
      if (type === 'START_DATE') {
        setStartDate(date);
        setEndDate(undefined);
      } else {
        setEndDate(date);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={goBack}>
      <Animated.View
        style={[
          styles.container,
          {
            paddingBottom: bottom,
          },
          animatedStyle,
        ]}>
        <View style={styles.header}>
          <AppText size={20} weight="bold" textAlign="center">
            {t('calendar.selectTime')}
          </AppText>
          <AppBlockButton onPress={goBack} style={{ padding: vs(16) }}>
            <IconClose />
          </AppBlockButton>
        </View>

        <CalendarPicker
          startFromMonday
          allowRangeSelection={!isSingleMode}
          weekdays={['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']}
          months={[
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12',
          ]}
          previousTitle="‹"
          nextTitle="›"
          selectedDayColor="#228b22"
          selectedDayTextColor="#fff"
          selectedRangeStartStyle={styles.rangeStart}
          selectedRangeEndStyle={styles.rangeEnd}
          selectedRangeStyle={styles.rangeBetween}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          minDate={minDate || undefined}
          maxDate={maxDate || undefined}
          selectYearTitle="Chọn năm "
          selectMonthTitle="Chọn tháng "
          onDateChange={onDateChange}
          dayLabelsWrapper={{
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
        />

        {!isSingleMode && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <AppText style={styles.resetText}>Đặt lại</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <AppText style={styles.saveText}>Lưu thông tin</AppText>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ModalPickCalendar;

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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
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
