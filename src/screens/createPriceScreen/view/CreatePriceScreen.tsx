// views/AssignPriceScreen.tsx

import React, { useRef, useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { getFontSize, SCREEN_WIDTH } from '../../../constants';
// import {AppText} from '../../elements/text/AppText';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';
import AppBlockButton from '../../../elements/button/AppBlockButton';

import IconNotification from '../../../../assets/icon/IconNotification';
import IconSearch from '../../../../assets/icon/IconSearch';
import IconFilter from '../../../../assets/icon/IconFillter';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { TypeCreatePrice } from '../modal/CreatePriceModal';
import Images from '../../../../assets/image/Images';
import { navigate } from '../../../navigation/RootNavigation';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import { useCreatePriceViewModel } from '../viewmodal/useCreatePriceViewModal';
import ToastContainer from '@/elements/toast/ToastContainer';
import CreatePriceCard from './component/CreatePriceCard';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import { Colors } from '@/theme/Config';
import { Gesture } from 'react-native-gesture-handler';
import IconCreatePrice from '@assets/icon/IconCreatePrice';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';

const CreatePriceScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  console.log('CreatePriceScreen');
  const refToast = useRef<any>(null);

  // ─── ViewModel MVVM ──────────────────────────────────────────────────────────
  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    onSearch,
    handleDelete,
    searchKey,
  } = useCreatePriceViewModel();
  const { infoUser } = useInfoUser();

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<TypeCreatePrice> | null>(null);
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
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    showScrollToTop.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = useCallback(() => {
    flashListRef.current?.scrollToEnd({ animated: true });
    showScrollToBottom.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * onScroll handler:
   *  - Nếu người dùng scroll xuống (y mới > y cũ) → hiện nút scroll‐to‐bottom, ẩn scroll‐to‐top.
   *  - Nếu người dùng scroll lên (y mới < y cũ)   → hiện nút scroll‐to‐top,    ẩn scroll‐to‐bottom.
   */
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Khi bấm "Tìm kiếm" (submit) hoặc nút "Filter" ───────────────────────
  const handleSubmitSearch = useCallback(() => {
    navigate('FilterScreen');
  }, []);

  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={light.primary} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <EmptyDataAnimation autoPlay />
        <AppText style={styles.emptyText}>{t('createPrice.empty')}</AppText>
        <AppBlockButton onPress={onCreatePrice} style={styles.buttonCreatePrice}>
          <AppText style={styles.textCreatePrice}>{t('createPrice.create')}</AppText>
        </AppBlockButton>
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, t]);

  const listFooterComponent = useMemo(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={light.primary} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage]);

  const goToNotification = useCallback(() => navigate('NotificationScreen'), []);
  const goToAccount = useCallback(() => navigate('AccountScreen'), []);
  const onCreatePrice = useCallback(() => navigate('CreatePriceNccScreen'), []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const flashListNativeGesture = useMemo(() => Gesture.Native(), []);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  }, []);

  // Callback để xử lý khi xóa thành công
  const handleDeleteSuccess = useCallback((deletedId: string) => {
    // Nếu item đã được selected thì trừ đi 1 số lượng
    setSelectedIds(prev => prev.filter(id => id !== deletedId));
    console.log(`✅ Item ${deletedId} deleted successfully and removed from selection`);
  }, []);

  const toggleSelectAll = useCallback(() => {
    const allIds = flatData.map(item => item.id);
    if (selectedIds.length === flatData.length) {
      setSelectedIds([]); // Bỏ chọn tất cả
    } else {
      setSelectedIds(allIds); // Chọn tất cả
    }
  }, [selectedIds.length, flatData]);

  const renderItem = useCallback(
    ({ item }: { item: TypeCreatePrice; index: number }) => (
      <CreatePriceCard
        item={item}
        handleDelete={id => handleDelete(id, handleDeleteSuccess)}
        handleSelect={handleSelect}
        isSelected={selectedIds.includes(item.id)}
        simultaneousGesture={flashListNativeGesture}
      />
    ),
    [handleDelete, handleSelect, selectedIds, flashListNativeGesture, handleDeleteSuccess],
  );

  const selectedAll = useMemo(
    () => selectedIds.length === flatData.length && flatData.length > 0,
    [selectedIds.length, flatData.length],
  );

  return (
    <View style={styles.container}>
      {/* ─── Background Image ─────────────────────────────────────────────── */}
      <FastImage
        id="backgroundImage"
        style={styles.backgroundImage}
        source={Images.BackgroundAssignPrice}
        resizeMode={FastImage.resizeMode.cover}
      />
      {/* ─── Header (không animate ẩn/hiện trong ví dụ này) ──────────────────── */}
      <View style={[styles.headerContainer, { marginTop: top }]}>
        <View style={styles.headerLeft}>
          <AppBlockButton onPress={goToAccount}>
            <FastImage source={{ uri: infoUser.profile.avatar }} style={styles.avatar} />
          </AppBlockButton>

          <View style={styles.greetingContainer}>
            <AppText color="#FFFFFF" style={styles.greetingText}>
              {t('createPrice.title')}
            </AppText>
            <AppText color="#FFFFFF" style={styles.greetingText}>
              {infoUser.profile.fullName}
            </AppText>
          </View>
        </View>
        <View style={styles.headerRight}>
          <AppBlockButton onPress={goToNotification} style={styles.notificationWrapper}>
            <IconNotification />
            <View style={styles.notificationBadge}>
              <AppText style={styles.notificationBadgeText}>3</AppText>
            </View>
          </AppBlockButton>
        </View>
      </View>
      {/* ─── Search Bar ────────────────────────────────────────────────────── */}
      <View style={styles.searchContainer}>
        <IconSearch width={vs(18)} />
        <TextInput
          value={searchKey}
          onChangeText={onSearch}
          placeholder={t('createPrice.searchPlaceholder')}
          placeholderTextColor={light.placeholderTextColor}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
        <AppBlockButton style={styles.filterButton} onPress={handleSubmitSearch}>
          <IconFilter />
        </AppBlockButton>
      </View>

      {/* ─── Title + Count Badge ───────────────────────────────────────────── */}
      <View style={styles.titleContainer}>
        <AppText style={styles.titleText}>{t('createPrice.supplierPriceList')}</AppText>
        <View style={styles.countBadge}>
          <AppText style={styles.countBadgeText}>{flatData.length}</AppText>
        </View>
      </View>
      <View style={styles.header}>
        <AppBlockButton onPress={toggleSelectAll} style={styles.buttonCenter}>
          {selectedAll ? <IconCheckBox /> : <IconUnCheckBox />}
          <AppText style={styles.ml7}>{t('createPrice.pickAll')}</AppText>
        </AppBlockButton>
        <AppText>
          {selectedIds.length} {t('createPrice.orderSelected')}
        </AppText>
      </View>
      {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
      {isLoading && flatData.length === 0 ? (
        <View style={styles.flexCenter}>
          <ActivityIndicator size="large" color={light.primary} />
        </View>
      ) : (
        <FlashList
          ref={flashListRef}
          data={flatData || []}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={onLoadMore}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          refreshing={isRefetching}
          nestedScrollEnabled={true}
          onRefresh={onRefresh}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={listFooterComponent}
          estimatedItemSize={100}
          contentContainerStyle={styles.listContent}
        />
      )}

      <ToastContainer ref={refToast} />
      {flatData.length > 0 && (
        <AppBlockButton onPress={onCreatePrice} style={styles.buttonCreatePrice2}>
          <IconCreatePrice />
        </AppBlockButton>
      )}
      {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
      <AnimatedButton
        onPress={scrollToTop}
        style={[styles.scrollTopContainer, opacityScrollTopStyle]}>
        <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
      </AnimatedButton>
      {!isFetchingNextPage && (
        <AnimatedButton
          onPress={scrollToBottom}
          style={[styles.scrollBottomContainer, opacityScrollBottomStyle]}>
          <IconScrollBottom />
        </AnimatedButton>
      )}
    </View>
  );
};

export default CreatePriceScreen;
export const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
const styles = StyleSheet.create({
  buttonCreatePrice: {
    padding: vs(16),
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
  },
  textCreatePrice: {
    fontSize: getFontSize(16),
    color: Colors.WHITE,
    fontWeight: '500',
  },
  ml7: { marginLeft: s(7) },
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonCreatePrice2: { position: 'absolute', bottom: vs(20), right: s(16) },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: vs(16),
    paddingHorizontal: s(16),
    // borderBottomWidth: 1,
  },
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    aspectRatio: 2.66,
    position: 'absolute',
    zIndex: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1,
    borderColor: light.white,
    height: vs(40),
    aspectRatio: 1,
    borderRadius: vs(20),
    marginRight: s(8),
  },
  greetingContainer: {
    height: vs(40),
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationWrapper: {
    width: vs(32),
    height: vs(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    borderWidth: 0.5,
    borderColor: light.white,
    position: 'absolute',
    top: vs(2),
    right: s(0),
    backgroundColor: '#FF3B30',
    width: vs(16),
    height: vs(16),
    borderRadius: vs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(8),
    fontWeight: '500',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(12),
    backgroundColor: light.white,
    borderRadius: s(8),
    paddingLeft: s(12),
    height: vs(46),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(12),
    fontWeight: '500',
    paddingVertical: 0,
    paddingLeft: s(6),
  },
  filterButton: {
    borderLeftWidth: 0.3,
    borderLeftColor: '#BABABA',
    height: vs(46),
    width: vs(46),
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(12),
  },
  titleText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#333333',
  },
  countBadge: {
    marginLeft: s(8),
    backgroundColor: light.primary,
    borderRadius: s(4),
    paddingVertical: vs(1),
  },
  countBadgeText: {
    color: light.white,
    paddingHorizontal: s(6),
    fontSize: getFontSize(14),
    fontWeight: '700',
  },

  listContent: {
    paddingHorizontal: PaddingHorizontal,
    paddingBottom: vs(16),
    // backgroundColor: '#F2F3F5',
    // flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },

  scrollBottomContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: vs(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  scrollTopContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: vs(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
