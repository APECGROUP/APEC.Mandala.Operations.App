import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Header from '@/screens/notificationScreen/view/component/Header';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import { Colors } from '@/theme/Config';
import { getFontSize } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import Footer from '@/screens/filterScreen/view/component/Footer';
import { goBack } from '@/navigation/RootNavigation';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
import { FlashList } from '@shopify/flash-list';
import CreateNewItemCard from './CreateNewItemCard';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedButton } from '@/screens/assignPriceScreen/view/AssignPriceScreen';
import IconScrollBottom from '@assets/icon/IconScrollBottom';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import moment from 'moment';
import { useAlert } from '@/elements/alert/AlertProvider';
import { Gesture } from 'react-native-gesture-handler';

const CreatePriceNccScreen = () => {
  const { t } = useTranslation();
  const { showToast } = useAlert();
  const [listItem, setListItem] = useState<IPickItem[]>([]);

  const onAddNewItemToList = () => {
    setListItem([
      ...listItem,
      {
        id: `${moment().unix()}_${Math.random().toString(36).substring(2, 9)}`,
        name: '',
        price: 0,
        end: '',
        vat: '0',
        ncc: '',
        time: '',
        dateFrom: '',
        dateTo: '',
        supplier: {
          id: '',
          name: '',
        },
      } as IPickItem,
    ]);
  };
  // const onCreateItem = () => {
  //   navigate('PickItemScreen', {
  //     setItem: onAddNewItemToList,
  //   });
  // };

  const flashListRef = useRef<FlashList<IPickItem> | null>(null);
  const lastOffsetY = useRef<number>(0);

  // show Scroll‐to‐Top khi scroll lên (swipe xuống), 0 = hidden, 1 = visible
  const showScrollToTop = useSharedValue<number>(0);
  // show Scroll‐to‐Bottom khi scroll xuống (swipe lên), 0 = hidden, 1 = visible
  const showScrollToBottom = useSharedValue<number>(0);

  // Animated styles
  const opacityScrollTopStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToTop.value, { duration: 200 }),
  }));
  const opacityScrollBottomStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToBottom.value, { duration: 200 }),
  }));

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = () => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    showScrollToTop.value = 0;
  };
  const scrollToBottom = () => {
    flashListRef.current?.scrollToEnd({ animated: true });
    showScrollToBottom.value = 0;
  };

  /**
   * onScroll handler:
   *  - Nếu người dùng scroll xuống (y mới > y cũ) → hiện nút scroll‐to‐bottom, ẩn scroll‐to‐top.
   *  - Nếu người dùng scroll lên (y mới < y cũ)   → hiện nút scroll‐to‐top,    ẩn scroll‐to‐bottom.
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    // Scroll xuống (lúc này y > lastOffsetY): hiện scroll‐to‐bottom, ẩn scroll‐to‐top
    if (y > lastOffsetY.current && y > 100) {
      showScrollToBottom.value = 1;
      showScrollToTop.value = 0;
    }
    // Scroll lên (y < lastOffsetY): hiện scroll‐to‐top, ẩn scroll‐to‐bottom
    else if (y < lastOffsetY.current && y > 100) {
      showScrollToTop.value = 1;
      showScrollToBottom.value = 0;
    } else {
      // Chưa vượt 100px thì ẩn cả hai
      showScrollToTop.value = 0;
      showScrollToBottom.value = 0;
    }
    lastOffsetY.current = y;
  };

  const listEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <EmptyDataAnimation autoPlay />
      </View>
    ),
    [],
  );
  const onUpdateItem = useCallback(
    (i: IPickItem) => {
      console.log('update item: ', i, listItem);
      setListItem(prevList => prevList.map(item => (item.id === i.id ? i : item)));
    },
    [listItem],
  );
  const handleDelete = useCallback((id: string) => {
    setListItem(prevList => prevList.filter(item => item.id !== id));
  }, []);

  const flashListNativeGesture = useMemo(() => Gesture.Native(), []);

  const renderItem = useCallback(
    ({ item, index }: { item: IPickItem; index: number }) => (
      <CreateNewItemCard
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onSaveInfo = async () => {
    if (listItem.length === 0) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    goBack();
    showToast(t('createPrice.saveInfoSuccess'), 'success');
    console.log('save info: ', listItem);
  };

  console.log('render : ', listItem);
  return (
    <View style={styles.flex1}>
      <Header primary title={t('createPrice.createPriceNcc')} iconWidth={s(40)} />

      <View style={styles.titleContainer}>
        <AppText style={styles.titleText}>{t('Danh sách gán giá NCC')}</AppText>
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={listEmptyComponent}
        estimatedItemSize={100}
        contentContainerStyle={styles.listContent}
      />
      <AnimatedButton
        onPress={scrollToTop}
        style={[styles.scrollBottomContainer, opacityScrollTopStyle]}>
        <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
      </AnimatedButton>
      <AnimatedButton
        onPress={scrollToBottom}
        style={[styles.scrollBottomContainer, opacityScrollBottomStyle]}>
        {/* style={[styles.scrollButtonContainer, opacityScrollBottomStyle]}> */}
        <IconScrollBottom />
      </AnimatedButton>
      <Footer
        onLeftAction={onAddNewItemToList}
        onRightAction={onSaveInfo}
        leftButtonTitle={t('createPrice.createNew')}
        rightButtonTitle={t('createPrice.saveInfo')}
      />
    </View>
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
