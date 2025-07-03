import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
// useFocusEffect không cần thiết nếu logic dùng `applyFilters`

import { getFontSize, SCREEN_WIDTH } from '../../../constants';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';
import AppBlockButton from '../../../elements/button/AppBlockButton';

import IconNotification from '../../../../assets/icon/IconNotification';
import IconSearch from '../../../../assets/icon/IconSearch';
import IconFilter from '../../../../assets/icon/IconFillter';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { DataAssignPrice } from '../modal/AssignPriceModal';
import Images from '../../../../assets/image/Images';
import { navigate } from '../../../navigation/RootNavigation';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import { useAssignPriceViewModel } from '../viewmodal/useAssignPriceViewModel';
import ToastContainer from '@/elements/toast/ToastContainer';
import AssignPriceCard from './component/AssignPriceCard';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import { isAndroid } from '@/utils/Utilities';

// Tạo AnimatedButton một lần duy nhất ngoài component
export const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

const AssignPriceScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  // ViewModel MVVM - không cần truyền activeFilters vào đây nữa,
  // ViewModel sẽ tự quản lý state filter nội bộ và debounce.
  // currentFilters từ ViewModel sẽ phản ánh trạng thái filter hiện tại của UI.
  const {
    data: flatData, // Đổi tên `flatData` thành `data` cho rõ ràng hơn trong component này
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    onSearchPrNo, // Hàm để cập nhật prNo khi gõ vào ô search
    applyFilters, // Hàm để áp dụng các filter từ FilterScreen
    currentPrNoInput, // Giá trị hiện tại trong ô input tìm kiếm (chưa debounce)
    currentFilters, // Toàn bộ object filter mà UI đang hiển thị (có thể chưa debounce)
    isError,
  } = useAssignPriceViewModel({}); // Truyền một object rỗng, ViewModel sẽ khởi tạo internal state của nó

  const refToast = useRef<any>(null);
  const flashListRef = useRef<FlashList<DataAssignPrice> | null>(null);
  const lastOffsetY = useRef<number>(0);

  const showScrollToTop = useSharedValue<number>(0);
  const showScrollToBottom = useSharedValue<number>(0);

  // Animated styles cho nút cuộn
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
      // Chỉ hiện khi cuộn đủ xa
      showScrollToBottom.value = 1;
      showScrollToTop.value = 0;
    }
    // Scroll lên (y < lastOffsetY): hiện scroll‐to‐top, ẩn scroll‐to‐bottom
    else if (y < lastOffsetY.current && y > 100) {
      // Chỉ hiện khi cuộn đủ xa
      showScrollToTop.value = 1;
      showScrollToBottom.value = 0;
    } else {
      // Chưa vượt 100px hoặc ở đầu danh sách thì ẩn cả hai
      showScrollToTop.value = 0;
      showScrollToBottom.value = 0;
    }
    lastOffsetY.current = y;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Khi bấm nút "Filter" ───────────────────────
  const goToFilterScreen = useCallback(() => {
    navigate('FilterScreen', {
      onApplyFilters: applyFilters, // Callback để FilterScreen gọi khi confirm
      currentFilters: currentFilters, // Filters hiện tại đang hiển thị trên màn hình A
    });
  }, [applyFilters, currentFilters]);
  const listEmptyComponent = useMemo(() => {
    if (isLoading && flatData.length === 0) {
      // Nếu đang loading và chưa có dữ liệu, hiển thị skeleton hoặc indicator
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={light.primary} />
        </View>
      );
    }
    // Nếu không loading và không có dữ liệu, hiển thị EmptyDataAnimation.
    // Dữ liệu chỉ thực sự rỗng khi isLoading là false và flatData.length là 0.
    if (!isLoading && flatData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyDataAnimation autoPlay />
          <AppText style={styles.emptyText}>{t('assignPrice.empty')}</AppText>
        </View>
      );
    }
    return null;
  }, [isLoading, flatData.length, t]);

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

  const renderItem = useCallback(
    ({ item, index }: { item: DataAssignPrice; index: number }) => (
      <AssignPriceCard item={item} index={index} />
    ),
    [],
  );

  const { infoUser } = useInfoUser();

  // Xử lý lỗi ban đầu hoặc khi có lỗi API
  const [hasInitialLoadError, setHasInitialLoadError] = useState(false);

  useEffect(() => {
    // Nếu có lỗi và không có dữ liệu để hiển thị, đánh dấu là có lỗi tải ban đầu
    if (isError && flatData.length === 0) {
      setHasInitialLoadError(true);
    } else if (!isError && hasInitialLoadError) {
      // Nếu lỗi đã được giải quyết và không còn lỗi, reset cờ lỗi
      setHasInitialLoadError(false);
    }
  }, [isError, flatData.length, hasInitialLoadError]);

  const reLoadData = useCallback(() => {
    setHasInitialLoadError(false); // Reset cờ lỗi để thử tải lại
    onRefresh(); // Gọi hàm refresh từ ViewModel
  }, [onRefresh]);

  // Hiển thị FallbackComponent nếu có lỗi tải ban đầu và không có dữ liệu
  if (hasInitialLoadError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  // Giả lập tổng số lượng item
  const total = 60; // Có thể lấy từ meta data của API
  return (
    <ViewContainer>
      <View style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          // backgroundColor="transparent" // Thường đặt transparent nếu có ảnh nền
          // translucent // Giúp nội dung tràn ra phía sau StatusBar
        />
        {/* ─── Background Image ─────────────────────────────────────────────── */}
        <FastImage
          style={styles.backgroundImage}
          source={Images.BackgroundAssignPrice}
          resizeMode={FastImage.resizeMode.cover}
        />
        {/* ─── Header (không animate ẩn/hiện trong ví dụ này) ──────────────────── */}
        <View style={[styles.headerContainer, { paddingTop: top + vs(5) }]}>
          <View style={styles.headerLeft}>
            <AppBlockButton onPress={goToAccount}>
              <FastImage source={{ uri: infoUser.profile.avatar }} style={styles.avatar} />
            </AppBlockButton>
            <View style={styles.greetingContainer}>
              <AppText color="#FFFFFF" style={styles.greetingText}>
                {t('assignPrice.title')}
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
            onChangeText={onSearchPrNo} // Gọi hàm debounce từ ViewModel
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
          <AppText style={styles.titleText}>{t('assignPrice.header')}</AppText>
          <View style={styles.countBadge}>
            <AppText style={styles.countBadgeText}>{total}</AppText>
          </View>
        </View>
        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && flatData.length === 0 ? (
          <View style={styles.listContent}>
            {/* Hiển thị Skeleton khi loading lần đầu và chưa có dữ liệu */}
            {new Array(3).fill(0).map(
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
            data={flatData} // Sử dụng flatData từ ViewModel
            renderItem={renderItem}
            keyExtractor={item => item.id} // Chỉ cần item.id là đủ cho key
            onEndReached={onLoadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            removeClippedSubviews
            refreshing={isRefetching}
            onRefresh={onRefresh}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListEmptyComponent={listEmptyComponent} // Chỉ hiện nếu data rỗng sau khi loading
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
            styles.scrollButtonBase, // Style chung
            isAndroid() && { bottom: vs(50) }, // Điều chỉnh vị trí cho Android nếu cần
            opacityScrollTopStyle,
          ]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AnimatedButton>
        {!isFetchingNextPage && ( // Chỉ hiển thị scroll to bottom nếu không đang fetching trang tiếp theo
          <AnimatedButton
            onPress={scrollToBottom}
            style={[styles.scrollButtonBase, opacityScrollBottomStyle]}>
            <IconScrollBottom />
          </AnimatedButton>
        )}
      </View>
    </ViewContainer>
  );
};

export default AssignPriceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    aspectRatio: 2.66,
    position: 'absolute',
    zIndex: -1,
    // top: 0, // Đảm bảo ảnh nằm ở top
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
    fontSize: getFontSize(14), // Tăng fontSize để dễ đọc
    fontWeight: '500',
    paddingVertical: 0,
    paddingLeft: s(6),
    color: light.text, // Đảm bảo màu chữ dễ nhìn
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
    marginHorizontal: s(16),
    marginBottom: vs(16),
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
    marginTop: vs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(14),
    color: '#666666',
    marginTop: vs(10), // Thêm khoảng cách
  },
  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },

  // Styles chung cho các nút cuộn
  scrollButtonBase: {
    position: 'absolute',
    alignSelf: 'center',
    width: vs(33), // Kích thước nút
    height: vs(33),
    borderRadius: vs(24), // Hình tròn
    backgroundColor: light.white, // Màu nền
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
