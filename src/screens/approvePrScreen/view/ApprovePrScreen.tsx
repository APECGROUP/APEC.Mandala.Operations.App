// views/AssignPriceScreen.tsx

import React, { useRef, useCallback, useMemo, useEffect } from 'react';
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
import { useRoute } from '@react-navigation/native';

import { getFontSize, SCREEN_WIDTH } from '../../../constants';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';
import AppBlockButton from '../../../elements/button/AppBlockButton';

import IconNotification from '../../../../assets/icon/IconNotification';
import IconSearch from '../../../../assets/icon/IconSearch';
import IconFilter from '../../../../assets/icon/IconFillter';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { IApprove } from '../modal/ApproveModal';
import Images from '../../../../assets/image/Images';
import { navigate } from '../../../navigation/RootNavigation';
import { AppText } from '@/elements/text/AppText';
import { useApproveViewModel } from '../viewmodal/useApproveViewModel';
import ToastContainer from '@/elements/toast/ToastContainer';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import { Colors } from '@/theme/Config';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import Footer from '@/screens/filterScreen/view/component/Footer';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { isAndroid } from '@/utils/Utilities';
import ApproveCard from './component/ApproveCard';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';

const ApprovePrScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const refToast = useRef<any>(null);
  const route = useRoute() as any;
  // ─── ViewModel MVVM ──────────────────────────────────────────────────────────
  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    onSearch, // Đổi tên từ onSearchPrNo thành onSearch
    applyFilters,
    currentPrNoInput, // Giá trị hiện tại trong ô input tìm kiếm (chưa debounce)
    currentFilters, // Toàn bộ object filter mà UI đang hiển thị (có thể chưa debounce)
    isError,
    onApproved,
    onReject,
    selectedIds,
    setSelectedIds,
  } = useApproveViewModel();
  const { infoUser } = useInfoUser();

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<IApprove> | null>(null);
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
   * - Nếu người dùng scroll xuống (y mới > y cũ) → hiện nút scroll‐to‐bottom, ẩn scroll‐to‐top.
   * - Nếu người dùng scroll lên (y mới < y cũ)   → hiện nút scroll‐to‐top,    ẩn scroll‐to‐bottom.
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

  // Lắng nghe params.filters trả về từ FilterScreen
  useEffect(() => {
    if (route.params?.filters) {
      applyFilters(route.params.filters);
    }
  }, [route.params?.filters, applyFilters]);

  const goToNotification = useCallback(() => navigate('NotificationScreen'), []);
  const goToAccount = useCallback(() => navigate('AccountScreen'), []);

  const reLoadData = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

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
      </View>
    );
     
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

  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
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
    ({ item }: { item: IApprove; index: number }) => (
      <ApproveCard
        item={item}
        handleSelect={handleSelect}
        isSelected={selectedIds.includes(item.id)}
      />
    ),
    [handleSelect, selectedIds],
  );

  const selectedAll = useMemo(
    () => selectedIds.length === flatData.length && flatData.length > 0,
    [selectedIds.length, flatData.length],
  );

  const goToFilterScreen = useCallback(() => {
    navigate('FilterScreen', {
      onApplyFilters: applyFilters, // Callback để FilterScreen gọi khi confirm
      currentFilters: currentFilters, // Filters hiện tại đang hiển thị trên màn hình A
    });
  }, [applyFilters, currentFilters]);

  console.log('ApprovePrScreen', flatData);

  // Bug fix: Ban đầu `isFirstLoad` là true và `isLoading` cũng true, `FallbackComponent` sẽ hiển thị
  // Sau khi load lần đầu xong, `isLoading` thành false, `isFirstLoad` vẫn true,
  // nên cần cập nhật `isFirstLoad` sau khi load thành công.
  // useEffect(() => {
  //   if (isFirstLoad && !isLoading && flatData.length > 0) {
  //     setIsFirstLoad(false);
  //   }
  // }, [isFirstLoad, isLoading, flatData.length]);

  const orderSelected = useMemo(() => selectedIds.length, [selectedIds]);

  if (isError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  return (
    <ViewContainer>
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
            value={currentPrNoInput} // Lấy giá trị từ ViewModel để đồng bộ UI với debounce
            onChangeText={onSearch} // Gọi hàm debounce từ ViewModel
            placeholder={t('assignPrice.searchPlaceholder')}
            placeholderTextColor={light.placeholderTextColor}
            style={styles.searchInput}
            // returnKeyType="search"
            // onSubmitEditing={goToFilterScreen} // Submit Search hoặc đi tới FilterScreen
          />
          <AppBlockButton style={styles.filterButton} onPress={goToFilterScreen}>
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
            {orderSelected} {t('createPrice.orderSelected')}
          </AppText>
        </View>
        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && flatData.length === 0 ? (
          <View style={styles.listContent}>
            {new Array(6).fill(0).map(
              (
                _,
                index, // Giảm số lượng skeleton để demo
              ) => (
                <SkeletonItem key={index} />
              ),
            )}
          </View>
        ) : (
          <FlashList
            ref={flashListRef}
            data={flatData || []}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            // onEndReached={onLoadMore}
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

        {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
        <AnimatedButton
          onPress={scrollToTop}
          style={[
            styles.scrollButtonBase,
            isAndroid() && { bottom: vs(50) },
            opacityScrollTopStyle,
          ]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AnimatedButton>
        {!isFetchingNextPage && (
          <AnimatedButton
            onPress={scrollToBottom}
            style={[styles.scrollButtonBase, opacityScrollBottomStyle]}>
            <IconScrollBottom />
          </AnimatedButton>
        )}
      </View>
      {selectedIds.length > 0 && (
        <Footer
          onLeftAction={() => onReject(selectedIds)}
          onRightAction={() => onApproved(selectedIds)}
          leftButtonTitle={t('createPrice.reject')}
          rightButtonTitle={t('createPrice.approvedOrder')}
          customBottom={vs(20)}
          leftButtonStyle={{ backgroundColor: Colors.ERROR_600 }}
          rightButtonStyle={{ backgroundColor: Colors.PRIMARY }}
          leftTextStyle={{ color: Colors.WHITE }}
          rightTextStyle={{ color: Colors.WHITE }}
        />
      )}
    </ViewContainer>
  );
};

export default ApprovePrScreen;
export const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
const styles = StyleSheet.create({
  ml7: { marginLeft: s(7) },
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  },
  emptyContainer: {
    flex: 1,
    marginTop: vs(100),
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
  scrollButtonBase: {
    position: 'absolute',
    alignSelf: 'center',
    width: vs(33),
    height: vs(33),
    borderRadius: vs(24),
    backgroundColor: light.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    bottom: vs(20),
  },
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },
});
