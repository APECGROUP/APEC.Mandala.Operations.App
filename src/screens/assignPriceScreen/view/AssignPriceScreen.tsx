import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
// useFocusEffect không cần thiết nếu logic dùng `applyFilters`

import light from '@/theme/light';
import AppBlockButton from '@/elements/button/AppBlockButton';

import IconNotification from '@assets/icon/IconNotification';
import IconSearch from '@assets/icon/IconSearch';
import IconFilter from '@assets/icon/IconFillter';
import IconScrollBottom from '@assets/icon/IconScrollBottom';

import { DataAssignPrice } from '../modal/AssignPriceModal';
import Images from '@assets/image/Images';
import { navigate } from '@/navigation/RootNavigation';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import { useAssignPriceViewModel } from '../viewmodal/useAssignPriceViewModel';
import ToastContainer from '@/elements/toast/ToastContainer';
import AssignPriceCard from './component/AssignPriceCard';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import { styles } from './style';

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

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // ─── Khi bấm nút "Filter" ───────────────────────
  const goToFilterScreen = useCallback(() => {
    navigate('FilterAssignPriceScreen', {
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
          <AppText style={styles.emptyText}>{t('assignPrice.empty')}</AppText>
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
        <View style={[styles.headerContainer, { paddingTop: top }]}>
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
            data={flatData} // Sử dụng flatData từ ViewModel
            renderItem={renderItem}
            keyExtractor={item => item?.id} // Chỉ cần item.id là đủ cho key
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
};

export default AssignPriceScreen;
