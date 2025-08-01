import { Keyboard, StatusBar, StyleSheet, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { getFontSize } from '../../../constants';
import { AppBlock } from '../../../elements/block/Block';
import AppTextInput from '../../../elements/textInput/AppTextInput';
import light from '../../../theme/light';
import { useTranslation } from 'react-i18next';
import { navigate } from '@/navigation/RootNavigation';
import { PaddingHorizontal } from '@/utils/Constans';
import IconArrowRight from '@assets/icon/IconArrowRight';
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
import { AppText } from '@/elements/text/AppText';
import { Colors } from '@/theme/Config';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';

const FilterCreatePriceScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<MainParams, 'FilterCreatePriceScreen'>) => {
  const { t } = useTranslation();

  // Lấy hàm callback onApplyFilters từ route params
  const onApplyFiltersCallback = route.params?.onApplyFilters;

  // Lấy các filter hiện tại từ params để khởi tạo state
  // Đảm bảo default values cho department và requester là { id: '', name: '' }
  const initialFilters: AssignPriceFilters = route.params?.currentFilters || {};

  const [ncc, setNcc] = useState<IItemSupplier | undefined>(
    initialFilters.ncc && initialFilters.ncc?.id ? initialFilters.ncc : undefined,
  );
  const [status, setStatus] = useState<SelectedOption>(
    initialFilters.status && initialFilters.status.id !== ''
      ? initialFilters.status
      : { id: '', name: '' },
  );
  const [item, setItem] = useState<IPickItem | undefined>(
    initialFilters.product && initialFilters.product.id ? initialFilters.product : undefined,
  );
  // --- Handlers cho việc chọn giá trị từ các Modal khác ---

  const onPressNcc = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickNccScreen', {
      setNcc,
      ncc, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [ncc]);
  console.log('filter', initialFilters);
  const onPressNameItem = useCallback(() => {
    Keyboard.dismiss(); // Ẩn bàn phím trước khi mở modal
    navigate('PickItemScreen', {
      setItem: (_item: SelectedOption) => setItem(_item),
      item: item, // Truyền giá trị đã chọn để Modal có thể hiển thị
    });
  }, [item]);

  // --- Xử lý khi người dùng xác nhận bộ lọc ---
  const onConfirm = useCallback(() => {
    // Tạo object filters mới từ state cục bộ của FilterScreen
    const newFilters: AssignPriceFilters = {
      ncc: ncc?.id ? ncc : undefined, // Nếu id rỗng thì là undefined
      status: status.id ? status : undefined, // Nếu id rỗng thì là undefined
      product: item?.id ? item : undefined, // Nếu id rỗng thì là undefined
    };

    // Gọi callback từ màn hình trước đó để áp dụng filter
    if (onApplyFiltersCallback) {
      onApplyFiltersCallback(newFilters);
    }
    navigation.goBack();
  }, [ncc, status, item, onApplyFiltersCallback, navigation]);

  const onReset = useCallback(() => {
    setNcc(undefined);
    setStatus({ id: '', name: '' });
    setItem(undefined);
  }, []);

  const statusList = [
    { id: '1', name: t('filter.statusFilter.approved') },
    { id: '2', name: t('filter.statusFilter.rejected') },
    { id: '3', name: t('filter.statusFilter.waiting') },
  ];

  return (
    <ViewContainer>
      <AppBlock style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <View style={styles.form}>
          <AppBlockButton style={styles.width100} onPress={onPressNcc}>
            <AppTextInput
              editable={false}
              labelStyle={styles.label}
              label={t('filter.ncc')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={ncc?.invoiceName}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>

          <AppBlockButton style={styles.width100} onPress={onPressNameItem}>
            <AppTextInput
              editable={false}
              labelStyle={styles.label}
              label={t('filter.nameItem')}
              placeholder={t('filter.pick')}
              placeholderTextColor={light.placeholderTextColor}
              value={item?.iName}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={styles.rightArrowIcon} />}
            />
          </AppBlockButton>
          <AppText style={[styles.label, styles.labelStatus]}>{t('filter.status')}</AppText>
          <View style={styles.statusContainer}>
            {statusList.map((sub: { id: string; name: string }) => {
              const isSelect = status.id === sub.id;
              const onPress = () => {
                setStatus(sub);
              };
              return (
                <AppBlockButton
                  key={sub.id}
                  style={[
                    styles.statusButton,
                    { backgroundColor: isSelect ? Colors.PRIMARY : Colors.GRAY_100 },
                  ]}
                  onPress={onPress}>
                  <AppText style={[isSelect ? styles.textButtonSelected : styles.textButton]}>
                    {sub.name}
                  </AppText>
                </AppBlockButton>
              );
            })}
          </View>
        </View>
        <Footer onLeftAction={onReset} onRightAction={onConfirm} />
      </AppBlock>
    </ViewContainer>
  );
};

export default FilterCreatePriceScreen;

const styles = StyleSheet.create({
  labelStatus: { alignSelf: 'flex-start', marginBottom: vs(12) },
  textButton: { fontSize: getFontSize(12), fontWeight: '500' },
  textButtonSelected: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: Colors.WHITE,
  },
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
  statusContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  statusButton: {
    width: '30%',
    height: vs(34),
    borderRadius: vs(101),
    backgroundColor: Colors.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
