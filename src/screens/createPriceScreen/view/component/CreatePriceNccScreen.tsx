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

const CreatePriceNccScreen = () => {
  const { onRefresh } = useCreatePriceViewModel();

  const { t } = useTranslation();
  const { showToast } = useAlert();
  const [listItem, setListItem] = useState<IItemVendorPrice[]>([]);
  const [listVat, setListVat] = useState<IItemVat[]>([]);
  const onAddNewItemToList = () => {
    setListItem([...listItem, { id: moment().unix() } as IItemVendorPrice]);
  };
  // const onCreateItem = () => {
  //   navigate('PickItemScreen', {
  //     setItem: onAddNewItemToList,
  //   });
  // };

  const flashListRef = useRef<FlashList<IItemVendorPrice> | null>(null);

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = () => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const listEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <EmptyDataAnimation autoPlay />
      </View>
    ),
    [],
  );
  const onUpdateItem = useCallback((i: IItemVendorPrice) => {
    setListItem(prevList => prevList.map(item => (item.id === i.id ? i : item)));
  }, []);
  const handleDelete = useCallback((id: number) => {
    setListItem(prevList => prevList.filter(item => item.id !== id));
  }, []);

  const flashListNativeGesture = useMemo(() => Gesture.Native(), []);
  const getListVat = async () => {
    // Fetch VAT list from API or any other source
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
      console.log('VAT list: ', response.data);
    } catch (error) {}
  };
  const renderItem = useCallback(
    ({ item, index }: { item: IItemVendorPrice; index: number }) => (
      <CreateNewItemCard
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
            viewPosition: 0.1, // 0 = top, 0.5 = center, 1 = bottom
          });
        }}
      />
    ),
    [flashListNativeGesture, handleDelete, listVat, onUpdateItem],
  );
  console.log('render list: ', listItem);
  const onSaveInfo = async () => {
    if (listItem.length === 0) {
      return;
    }
    try {
      const { isSuccess, message } = await checkCreatePrice(listItem);
      if (!isSuccess) {
        return showToast(message || t('error.subtitle'), 'error');
      }
      await onRefresh();
      goBack();
      showToast(t('createPrice.saveInfoSuccess'), 'success');
    } catch (error) {
      return showToast(t('error.subtitle'), 'error');
    }
  };

  useEffect(() => {
    getListVat();
  }, []);

  return (
    <ViewContainer>
      <View style={styles.flex1}>
        <Header primary title={t('createPrice.createPriceNcc')} iconWidth={s(40)} />

        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('createPrice.listCreatePriceNcc')}</AppText>
          {/* <View style={styles.countBadge}>
          <AppText style={styles.countBadgeText}>{0}</AppText>
        </View> */}
        </View>

        <FlashList
          ref={flashListRef}
          // data={[]}
          data={listItem || []}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          scrollEventThrottle={16}
          ListEmptyComponent={listEmptyComponent}
          estimatedItemSize={100}
          contentContainerStyle={styles.listContent}
        />
        <AppBlockButton onPress={scrollToTop} style={[styles.scrollBottomContainer]}>
          <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
        </AppBlockButton>
        <Footer
          onLeftAction={onAddNewItemToList}
          onRightAction={onSaveInfo}
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
    bottom: vs(50),
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
