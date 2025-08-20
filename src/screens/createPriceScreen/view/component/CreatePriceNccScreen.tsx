import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/screens/notificationScreen/view/component/Header';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import { Colors } from '@/theme/Config';
import { getFontSize } from '@/constants';
import { ENDPOINT, PaddingHorizontal } from '@/utils/Constans';
import Footer from '@/screens/filterScreen/view/component/Footer';
import { goBack } from '@/navigation/RootNavigation';
import { FlashList } from '@shopify/flash-list';
import CreateNewItemCard from './CreateNewItemCard';
import IconScrollBottom from '@assets/icon/IconScrollBottom';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import { useAlert } from '@/elements/alert/AlertProvider';
import { Gesture } from 'react-native-gesture-handler';
import AppBlockButton from '@/elements/button/AppBlockButton';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import {
  checkCreatePrice,
  IItemVat,
  IItemVendorPrice,
  IResponseListVat,
} from '../../modal/CreatePriceModal';
import moment from 'moment';
import api from '@/utils/setup-axios';
import { useCreatePriceViewModel } from '../../viewmodal/useCreatePriceViewModal';
import { TYPE_TOAST } from '@/elements/toast/Message';

const CreatePriceNccScreen = () => {
  const { onRefresh } = useCreatePriceViewModel();
  const { t } = useTranslation();
  const { showToast, showLoading, hideLoading } = useAlert();

  const [listItem, setListItem] = useState<IItemVendorPrice[]>([]);
  const [listVat, setListVat] = useState<IItemVat[]>([]);
  const [timeSystem, setTimeSystem] = useState('');

  const flashListRef = useRef<FlashList<IItemVendorPrice> | null>(null);
  const flashListNativeGesture = useMemo(() => Gesture.Native(), []);

  // Hàm tiện ích để kiểm tra tính hợp lệ của một đối tượng
  const isValidItem = useCallback(
    (item: IItemVendorPrice): boolean =>
      // Luồng 1: Kiểm tra các trường bắt buộc
      !!item.vendorCode &&
      !!item.itemCode &&
      !!item.validFrom &&
      !!item.validTo &&
      !!item.price &&
      !!item.vatCode,
    [],
  );

  // Hàm thêm một item mới vào danh sách
  const onAddNewItemToList = useCallback(() => {
    setListItem(prevList => [{ id: moment().unix() } as IItemVendorPrice, ...prevList]);
  }, []);

  // Hàm cập nhật một item trong danh sách
  const onUpdateItem = useCallback((updatedItem: IItemVendorPrice) => {
    setListItem(prevList => {
      // Kiểm tra có item nào khác có cùng itemCode chưa
      const isDuplicated = prevList.some(
        item => item.itemCode === updatedItem.itemCode && item.id !== updatedItem.id,
      );

      if (isDuplicated) {
        // Nếu trùng thì giữ nguyên list, không update
        showToast(`${updatedItem.itemName} đã tồn tại trên hệ thống`, TYPE_TOAST.ERROR);
        return prevList;
      }

      // Nếu không trùng thì update
      return prevList.map(item => (item.id === updatedItem.id ? updatedItem : item));
    });
  }, []);

  // Hàm xóa một item khỏi danh sách
  const handleDelete = useCallback((id: number) => {
    setListItem(prevList => prevList.filter(item => item.id !== id));
  }, []);

  // Hàm scroll lên đầu trang
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Hàm lưu thông tin
  const onSaveInfo = useCallback(async () => {
    // Luồng 1: Kiểm tra nếu danh sách rỗng
    if (listItem.length === 0) {
      return showToast(t('createPrice.noItemToSave'), 'warning');
    }

    // Luồng 2: Kiểm tra tính hợp lệ của tất cả các item
    const isInvalid = listItem.some(item => !isValidItem(item));
    if (isInvalid) {
      return showToast(t('createPrice.error'), 'error');
    }

    // Luồng 3: Gọi API và xử lý
    try {
      showLoading();
      const { isSuccess, message } = await checkCreatePrice(listItem);

      if (!isSuccess) {
        return showToast(message || t('error.subtitle'), 'error');
      }

      await onRefresh();
      goBack();
      showToast(t('createPrice.saveInfoSuccess'), 'success');
    } catch (error) {
      return showToast(t('error.subtitle'), 'error');
    } finally {
      hideLoading();
    }
  }, [listItem, isValidItem, onRefresh, t, showToast, showLoading, hideLoading]);

  // Hàm render item cho FlashList
  const renderItem = useCallback(
    ({ item, index }: { item: IItemVendorPrice; index: number }) => (
      <CreateNewItemCard
        timeSystem={timeSystem}
        listVat={listVat}
        simultaneousGesture={flashListNativeGesture}
        handleDelete={handleDelete}
        item={item}
        index={index}
        onUpdateItem={onUpdateItem}
        onFocusComment={() => {
          flashListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.1,
          });
        }}
      />
    ),
    [flashListNativeGesture, handleDelete, listVat, onUpdateItem],
  );

  // Component rỗng cho FlashList
  const listEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <EmptyDataAnimation autoPlay />
      </View>
    ),
    [],
  );

  // Lấy danh sách VAT khi component được mount
  const getListVat = async () => {
    try {
      const params = {
        pagination: {
          pageIndex: 1,
          pageSize: 50,
          isAll: true,
        },
        filter: {},
      };

      const response = await api.post<IResponseListVat, any>(ENDPOINT.GET_LIST_VAT, params);
      if (response.status === 200 && response.data.isSuccess) {
        setListVat(response.data.data);
      } else {
        showToast(t('error.subtitle'), 'error');
        goBack();
      }
    } catch (error) {
      showToast(t('error.subtitle'), 'error');
      goBack();
    }
  };
  const getTimeSystem = async () => {
    try {
      const response = await api.get<IResponseListVat, any>(ENDPOINT.GET_TIME_SYSTEM);
      if (response.status === 200 && response.data.isSuccess && response.data?.data?.varValue) {
        console.log('giờ hệ thống', response.data.data.varValue, response.data.data);
        setTimeSystem(response.data.data.varValue);
      } else {
        showToast(t('Lỗi khi lấy giờ hệ thông'), 'error');
      }
    } catch (error) {
      showToast(t('Lỗi khi lấy giờ hệ thông'), 'error');
      goBack();
    }
  };
  useEffect(() => {
    getListVat();
    getTimeSystem();
  }, [t, showToast]);

  return (
    <ViewContainer>
      <View style={styles.flex1}>
        <Header primary title={t('createPrice.createPriceNcc')} iconWidth={s(40)} />

        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('createPrice.listCreatePriceNcc')}</AppText>
        </View>

        <FlashList
          ref={flashListRef}
          data={listItem}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmptyComponent}
          estimatedItemSize={vs(300)} // Giúp FlashList render mượt hơn
          contentContainerStyle={styles.listContent}
        />

        <AppBlockButton onPress={scrollToTop} style={styles.scrollBottomContainer}>
          <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
        </AppBlockButton>

        <Footer
          onLeftAction={onAddNewItemToList}
          onRightAction={onSaveInfo}
          rippleDuration={0}
          leftButtonTitle={t('createPrice.createNew')}
          rightButtonTitle={t('createPrice.saveInfo')}
        />
      </View>
    </ViewContainer>
  );
};

export default CreatePriceNccScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBottomContainer: {
    position: 'absolute',
    right: s(16),
    bottom: vs(100),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flex1: { flex: 1 },
  listContent: {
    paddingHorizontal: PaddingHorizontal,
    flexGrow: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    paddingVertical: vs(12),
  },
  titleText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#333333',
  },
});
