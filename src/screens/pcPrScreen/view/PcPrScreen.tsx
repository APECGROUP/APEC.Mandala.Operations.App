import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
// useFocusEffect không cần thiết nếu logic dùng `applyFilters`

import light from '@/theme/light';
import AppBlockButton from '@/elements/button/AppBlockButton';

import IconScrollBottom from '@assets/icon/IconScrollBottom';

import { navigate } from '@/navigation/RootNavigation';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import ToastContainer from '@/elements/toast/ToastContainer';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import { styles } from './style';
import { usePcPrViewModel } from '../viewmodal/usePcPrViewModel';
import { IItemPcPr } from '../modal/PcPrModal';
import PcPrCard from './component/PcPrCard';
import HeaderSearch from '@/components/headerSearch/HeaderSearch';

export default function PcPrScreen() {
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
    length,
  } = usePcPrViewModel(); // Truyền một object rỗng, ViewModel sẽ khởi tạo internal state của nó

  const refToast = useRef<any>(null);
  const flashListRef = useRef<FlashList<IItemPcPr> | null>(null);

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // ─── Khi bấm nút "Filter" ───────────────────────
  const goToFilterScreen = useCallback(() => {
    navigate('FilterPcPrScreen', {
      onApplyFilters: applyFilters, // Callback để FilterScreen gọi khi confirm
      currentFilters: currentFilters, // Filters hiện tại đang hiển thị trên màn hình A
    });
  }, [applyFilters, currentFilters]);
  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      // Nếu đang loading và chưa có dữ liệu, hiển thị skeleton hoặc indicator
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={light.primary} />
        </View>
      );
    }
    // Nếu không loading và không có dữ liệu, hiển thị EmptyDataAnimation.
    // Dữ liệu chỉ thực sự rỗng khi isLoading là false và flatData.length là 0.
    if (!isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyDataAnimation autoPlay />
          <AppText style={styles.emptyText}>{t('pcPr.listEmpty')}</AppText>
        </View>
      );
    }
    return null;
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

  const renderItem = useCallback(
    ({ item, index }: { item: IItemPcPr; index: number }) => <PcPrCard item={item} index={index} />,
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
  const total = useMemo(() => flatData.length, [flatData.length]); // Có thể lấy từ meta data của API
  if (hasInitialLoadError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  // Giả lập tổng số lượng item
  return (
    <ViewContainer>
      <View style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          // backgroundColor="transparent" // Thường đặt transparent nếu có ảnh nền
          // translucent // Giúp nội dung tràn ra phía sau StatusBar
        />

        {/* ─── Background Image ─────────────────────────────────────────────── */}

        <HeaderSearch
          currentPrNoInput={currentPrNoInput}
          onSearch={onSearchPrNo}
          textPlaceholder={t('pcPr.searchPlaceholder')}
          goToFilterScreen={goToFilterScreen}
        />

        {/* ─── Title + Count Badge ───────────────────────────────────────────── */}
        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('assignPrice.header')}</AppText>
          <View style={styles.countBadge}>
            <AppText style={styles.countBadgeText}>{length}</AppText>
          </View>
        </View>
        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && flatData.length === 0 ? (
          <View style={styles.listContent}>
            {/* Hiển thị Skeleton khi loading lần đầu và chưa có dữ liệu */}
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
            data={flatData || []} // Sử dụng flatData từ ViewModel
            renderItem={renderItem}
            keyExtractor={item => item?.id?.toString()} // Chỉ cần item.id là đủ cho key
            onEndReached={onLoadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            removeClippedSubviews
            refreshing={isRefetching}
            onRefresh={onRefresh}
            scrollEventThrottle={16}
            ListEmptyComponent={listEmptyComponent} // Chỉ hiện nếu data rỗng sau khi loading
            ListFooterComponent={listFooterComponent}
            estimatedItemSize={100}
            contentContainerStyle={styles.listContent}
          />
        )}

        <ToastContainer ref={refToast} />

        {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
        <AppBlockButton onPress={scrollToTop} style={[styles.scrollButtonBase]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AppBlockButton>
      </View>
    </ViewContainer>
  );
}
