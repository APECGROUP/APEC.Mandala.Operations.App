import { Keyboard, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import { getFontSize } from '../../../constants';
import { AppBlock } from '../../../elements/block/Block';
import AppTextInput from '../../../elements/textInput/AppTextInput';
import light from '../../../theme/light';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { navigate } from '@/navigation/RootNavigation';
import { PaddingHorizontal } from '@/utils/Constans';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconCalendar from '@assets/icon/IconCalendar';
import { vs, s } from 'react-native-size-matters'; // Import s
import Footer from './component/Footer';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { MainParams } from '@/navigation/params';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AssignPriceFilters,
  SelectedOption,
} from '@/screens/assignPriceScreen/modal/AssignPriceModal';

const FilterApproveScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<MainParams, 'FilterApproveScreen'>) => {
  const { t } = useTranslation();

  // Lấy hàm callback onApplyFilters từ route params
  const onApplyFiltersCallback = route.params?.onApplyFilters;

  // Lấy các filter hiện tại từ params để khởi tạo state
  // Đảm bảo default values cho department và requester là { id: '', name: '' }
  const initialFilters: AssignPriceFilters = route.params?.currentFilters || {};

  const [prNo, setPrNo] = useState<string>(initialFilters.prNo || initialFilters?.searchKey || '');
  const [fromDate, setFromDate] = useState<Date | undefined>(initialFilters.fromDate);
  const [toDate, setToDate] = useState<Date | undefined>(initialFilters.toDate);
  const [department, setDepartment] = useState<SelectedOption>(
    initialFilters.department && initialFilters.department.id !== ''
      ? initialFilters.department
      : { id: '', name: '' },
  );
  const [location, setLocation] = useState<SelectedOption>(
    initialFilters.location && initialFilters.location.id !== ''
      ? initialFilters.location
      : { id: '', name: '' },
  );
  const [requester, setRequester] = useState<SelectedOption>(
    initialFilters.requester && initialFilters.requester.id !== ''
      ? initialFilters.requester
      : { id: '', name: '' },
  );

  // Ref cho TextInput để quản lý focus (có thể không cần thiết nếu dùng AppTextInput đúng cách)
  const refFromDate = useRef<TextInput>(null);
  const refToDate = useRef<TextInput>(null);
  const refLocation = useRef<TextInput>(null);
  // --- Handlers cho việc chọn giá trị từ các Modal khác ---
  const onPressPickTime = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('ModalPickCalendar', {
      isSingleMode: false,
      onSelectRange: (start: Date, end: Date) => {
        setFromDate(start);
        setToDate(end);
      },
      initialStartDate: fromDate,
      initialEndDate: toDate,
    });
  }, [fromDate, toDate]);
  console.log('filter', initialFilters);

  const onPressDepartment = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickDepartmentScreen', {
      setDepartment: (dep: SelectedOption) => setDepartment(dep),
      department: department, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [department]);
  const onPressLocation = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickLocalScreen', {
      setLocation: (loc: SelectedOption) => setLocation(loc),
      location: location, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [location]);
  console.log('filter', initialFilters);
  const onPressRequester = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickRequesterScreen', {
      setRequester: (req: SelectedOption) => setRequester(req),
      requester: requester, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [requester]);

  // --- Xử lý khi người dùng xác nhận bộ lọc ---
  const onConfirm = useCallback(() => {
    // Tạo object filters mới từ state cục bộ của FilterScreen
    const newFilters: AssignPriceFilters = {
      prNo: prNo.trim() || undefined, // Đảm bảo prNo rỗng thì thành undefined
      fromDate,
      toDate,
      department: department.id ? department : undefined, // Nếu id rỗng thì là undefined
      requester: requester.id ? requester : undefined, // Nếu id rỗng thì là undefined
      location: location.id ? location : undefined, // Nếu id rỗng thì là undefined
    };

    // Gọi callback từ màn hình trước đó để áp dụng filter
    if (onApplyFiltersCallback) {
      onApplyFiltersCallback(newFilters);
    }
    navigation.goBack();
  }, [prNo, fromDate, toDate, department, requester, onApplyFiltersCallback, navigation]);

  const onReset = useCallback(() => {
    setPrNo('');
    setFromDate(undefined);
    setToDate(undefined);
    setDepartment({ id: '', name: '' });
    setRequester({ id: '', name: '' });
    setLocation({ id: '', name: '' });
  }, []);

  const valueDate =
    fromDate && toDate
      ? moment(fromDate).format('DD/MM/YYYY') + ' - ' + moment(toDate).format('DD/MM/YYYY')
      : '';
  return (
    <ViewContainer>
      <AppBlock style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <View style={styles.form}>
          <AppTextInput
            labelStyle={styles.label}
            label={t('filter.prNo')}
            placeholder={t('filter.pick')}
            placeholderTextColor={light.placeholderTextColor}
            maxLength={20} // Tăng maxLength lên một chút nếu cần
            value={prNo}
            onChangeText={setPrNo}
            onBlur={Keyboard.dismiss}
            inputStyle={styles.input}
          />

          <AppBlockButton style={styles.width100} onPress={onPressPickTime}>
            <AppTextInput
              editable={false}
              refName={refFromDate}
              labelStyle={styles.label}
              label={t('filter.time')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={valueDate}
              inputStyle={styles.input}
              rightIcon={<IconCalendar fill={'#BABABA'} />}
            />
          </AppBlockButton>

          <AppBlockButton style={styles.width100} onPress={onPressDepartment}>
            <AppTextInput
              editable={false}
              labelStyle={styles.label}
              label={t('filter.department')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={department?.name}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>
          <AppBlockButton style={styles.width100} onPress={onPressLocation}>
            <AppTextInput
              editable={false}
              refName={refLocation}
              labelStyle={styles.label}
              label={t('filter.location')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={location?.name}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>

          <AppBlockButton style={styles.width100} onPress={onPressRequester}>
            <AppTextInput
              editable={false}
              labelStyle={styles.label}
              label={t('filter.requester')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={requester?.name}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>
        </View>
        <Footer onLeftAction={onReset} onRightAction={onConfirm} />
      </AppBlock>
    </ViewContainer>
  );
};

export default FilterApproveScreen;

const styles = StyleSheet.create({
  width100: { width: '100%' },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: light.background, // Thêm màu nền cho container chính
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    width: '100%',
    paddingTop: vs(20), // Thêm padding top để không bị sát Status Bar
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  input: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    borderWidth: 0,
    width: '100%',
    height: vs(40),
    borderRadius: vs(6),
    backgroundColor: light.backgroundTextInput,
    marginBottom: vs(16),
    paddingHorizontal: s(12), // Thêm padding ngang cho input
  },
  rightArrowIcon: {
    transform: [{ rotate: '90deg' }], // Icon quay 90 độ
  },
});
