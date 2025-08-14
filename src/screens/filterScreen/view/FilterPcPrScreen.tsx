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
import { IPickLocal } from '@/views/modal/modalPickLocal/modal/PickLocalModal';
import { PcPrFilters } from '@/screens/pcPrScreen/modal/PcPrModal';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IItemStatus } from '@/zustand/store/useStatusGlobal/useStatusGlobal';

const FilterPcPrScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<MainParams, 'FilterPcPrScreen'>) => {
  const { t } = useTranslation();
  // const {} = usePcPrViewModel();
  // Lấy hàm callback onApplyFilters từ route params
  const onApplyFiltersCallback = route.params?.onApplyFilters;

  // Lấy các filter hiện tại từ params để khởi tạo state
  // Đảm bảo default values cho department và requester là { id: '', name: '' }
  const initialFilters: PcPrFilters = route.params?.currentFilters || {};

  const [prNo, setPrNo] = useState<string>(initialFilters.prNo || initialFilters?.searchKey || '');
  const [po, setPo] = useState<string>(initialFilters.prNo || initialFilters?.searchKey || '');
  const [fromDate, setFromDate] = useState<Date | undefined>(initialFilters.prDate);
  const [toDate, setToDate] = useState<Date | undefined>(initialFilters.expectedDate);
  const [department, setDepartment] = useState<IPickDepartment | undefined>(
    initialFilters.department && initialFilters.department.id
      ? initialFilters.department
      : undefined,
  );
  const [location, setLocation] = useState<IPickLocal | undefined>(
    initialFilters.store && initialFilters.store.id ? initialFilters.store : undefined,
  );
  const [status, setStatus] = useState<IItemStatus | undefined>(
    initialFilters.status && initialFilters.status.status !== ''
      ? initialFilters.status
      : undefined,
  );

  // Ref cho TextInput để quản lý focus (có thể không cần thiết nếu dùng AppTextInput đúng cách)
  const refFromDate = useRef<TextInput>(null);

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

  const onPressDepartment = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickDepartmentScreen', {
      setDepartment,
      department, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [department]);
  // console.log('filter', initialFilters);
  const onPickLocation = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickLocalScreen', {
      setLocation,
      location,
    });
  }, [location]);
  const onPickStatus = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickStatusScreen', {
      setStatus,
      status, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [status]);

  // --- Xử lý khi người dùng xác nhận bộ lọc ---
  const onConfirm = useCallback(() => {
    // Tạo object filters mới từ state cục bộ của FilterScreen
    const newFilters: PcPrFilters = {
      prNo: prNo.trim() || undefined, // Đảm bảo prNo rỗng thì thành undefined
      pO: po.trim() || undefined, // Đảm bảo po rỗng thì thành undefined
      prDate: fromDate,
      expectedDate: toDate,
      department: department?.id ? department : undefined, // Nếu id rỗng thì là undefined
      store: location?.id ? location : undefined, // Nếu id rỗng thì là undefined
      status: status?.status ? status : undefined, // Nếu code rỗng thì là undefined
    };

    // Gọi callback từ màn hình trước đó để áp dụng filter
    if (onApplyFiltersCallback) {
      onApplyFiltersCallback(newFilters);
    }
    navigation.goBack();
  }, [
    prNo,
    po,
    fromDate,
    toDate,
    department,
    location,
    status,
    onApplyFiltersCallback,
    navigation,
  ]);

  const onReset = useCallback(() => {
    setPrNo('');
    setFromDate(undefined);
    setToDate(undefined);
    setDepartment(undefined);
    setStatus(undefined);
    setLocation(undefined);
    setPo('');
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
            label={'PR No'}
            placeholder={t('filter.input')}
            placeholderTextColor={light.placeholderTextColor}
            maxLength={20} // Tăng maxLength lên một chút nếu cần
            value={prNo}
            onChangeText={setPrNo}
            onBlur={Keyboard.dismiss}
            inputStyle={styles.input}
          />
          <AppTextInput
            labelStyle={styles.label}
            label={'PO'}
            placeholder={t('filter.input')}
            placeholderTextColor={light.placeholderTextColor}
            maxLength={20} // Tăng maxLength lên một chút nếu cần
            value={po}
            onChangeText={setPo}
            onBlur={Keyboard.dismiss}
            inputStyle={styles.input}
          />

          <AppBlockButton style={styles.width100} onPress={onPressPickTime}>
            <AppTextInput
              editable={false}
              refName={refFromDate}
              labelStyle={styles.label}
              label={t('filter.timePo')}
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
              value={department?.departmentName}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>

          <AppBlockButton style={styles.width100} onPress={onPickLocation}>
            <AppTextInput
              editable={false}
              labelStyle={styles.label}
              label={t('filter.location')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={location?.storeName}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>
          <AppBlockButton style={styles.width100} onPress={onPickStatus}>
            <AppTextInput
              editable={false}
              labelStyle={styles.label}
              label={t('filter.status')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={status?.statusName}
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

export default FilterPcPrScreen;

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
