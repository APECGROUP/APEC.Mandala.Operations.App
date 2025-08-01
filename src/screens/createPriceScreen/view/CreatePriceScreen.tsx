// views/AssignPriceScreen.tsx

import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';

import light from '@/theme/light';
import AppBlockButton from '@/elements/button/AppBlockButton';

import IconNotification from '@assets/icon/IconNotification';
import IconSearch from '@assets/icon/IconSearch';
import IconFilter from '@assets/icon/IconFillter';
import IconScrollBottom from '@assets/icon/IconScrollBottom';

import { TypeCreatePrice } from '../modal/CreatePriceModal';
import Images from '@assets/image/Images';
import { navigate } from '@/navigation/RootNavigation';
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
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import IconPlus from '@assets/icon/IconPlus';
import Footer from '@/screens/filterScreen/view/component/Footer';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { styles } from './style';

const CreatePriceScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const refToast = useRef<any>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const route = useRoute() as any;
  // ─── ViewModel MVVM ──────────────────────────────────────────────────────────
  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    currentPrNoInput, // Giá trị hiện tại trong ô input tìm kiếm (chưa debounce)
    currentFilters, // Toàn bộ object filter mà UI đang hiển thị (có thể chưa debounce)
    isError,
    selectedIds,
    onSearch, // Đổi tên từ onSearchPrNo thành onSearch
    onRefresh,
    // onLoadMore,
    applyFilters,
    onApproved,
    onReject,
    toggleSelectAll,
    handleSelect,
    selectedAll,
  } = useCreatePriceViewModel();
  const { infoUser } = useInfoUser();

  const flashListNativeGesture = useMemo(() => Gesture.Native(), []);

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<TypeCreatePrice> | null>(null);

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  useEffect(() => {
    if (route.params?.filters) {
      applyFilters(route.params.filters);
    }
  }, [route.params?.filters, applyFilters]);

  const goToNotification = useCallback(() => navigate('NotificationScreen'), []);
  const goToAccount = useCallback(() => navigate('AccountScreen'), []);
  const onCreatePrice = useCallback(() => navigate('CreatePriceNccScreen'), []);

  const reLoadData = useCallback(() => {
    setIsFirstLoad(false);
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
        <FastImage source={Images.IconEmptyDataAssign} style={styles.emptyImage} />
        <AppText style={styles.emptyText}>{t('createPrice.empty')}</AppText>
        <AppBlockButton onPress={onCreatePrice} style={styles.buttonCreatePrice}>
          <IconPlus fill={Colors.WHITE} />
          <AppText style={styles.textCreatePrice}>{t('createPrice.createPrice')}</AppText>
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

  const length = useMemo(() => selectedIds.length, [selectedIds]);
  const renderItem = useCallback(
    ({ item }: { item: TypeCreatePrice; index: number }) => (
      <CreatePriceCard
        item={item}
        handleSelect={handleSelect}
        isSelected={selectedIds.includes(item.id)}
        simultaneousGesture={flashListNativeGesture}
      />
    ),
    [handleSelect, selectedIds, flashListNativeGesture],
  );

  const goToFilterScreen = useCallback(() => {
    navigate('FilterCreatePriceScreen', {
      onApplyFilters: applyFilters, // Callback để FilterScreen gọi khi confirm
      currentFilters: currentFilters, // Filters hiện tại đang hiển thị trên màn hình A
    });
  }, [applyFilters, currentFilters]);

  console.log('CreatePriceScreen', flatData);

  if (isError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  return (
    <ViewContainer>
      <View style={styles.container}>
        {/* ─── Background Image ─────────────────────────────────────────────── */}
        <ImageBackground
          source={Images.BackgroundAssignPrice}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.imageBackground}>
          {/* ─── Header (không animate ẩn/hiện trong ví dụ này) ──────────────────── */}
          <View style={[styles.headerContainer, { marginTop: top }]}>
            <View style={styles.headerLeft}>
              <AppBlockButton onPress={goToAccount}>
                <FastImage source={{ uri: infoUser?.signature }} style={styles.avatar} />
              </AppBlockButton>

              <View style={styles.greetingContainer}>
                <AppText color="#FFFFFF" style={styles.greetingText}>
                  {t('createPrice.title')}
                </AppText>
                <AppText color="#FFFFFF" style={styles.greetingText}>
                  {infoUser?.displayName}
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
              placeholderTextColor={Colors.TEXT_SECONDARY}
              style={styles.searchInput}
              // returnKeyType="search"
              // onSubmitEditing={goToFilterScreen} // Submit Search hoặc đi tới FilterScreen
            />
            <AppBlockButton style={styles.filterButton} onPress={goToFilterScreen}>
              <IconFilter />
            </AppBlockButton>
          </View>
        </ImageBackground>

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
            {length} {t('createPrice.orderSelected')}
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
            scrollEventThrottle={16}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            estimatedItemSize={100}
            contentContainerStyle={styles.listContent}
            style={styles.containerFlashList}
          />
        )}

        <ToastContainer ref={refToast} />
        {flatData.length > 0 && length === 0 && (
          <AppBlockButton onPress={onCreatePrice} style={styles.buttonCreatePrice2}>
            <IconCreatePrice />
          </AppBlockButton>
        )}
        {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
        <AppBlockButton onPress={scrollToTop} style={[styles.scrollButtonBase]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AppBlockButton>
      </View>
      {length > 0 && (
        <Footer
          onLeftAction={onReject}
          onRightAction={onApproved}
          leftButtonTitle={t('createPrice.reject')}
          rightButtonTitle={t('createPrice.approvedOrder')}
          customBottom={vs(20)}
        />
      )}
    </ViewContainer>
  );
};

export default CreatePriceScreen;
