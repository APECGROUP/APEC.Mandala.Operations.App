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

import { TypeCreatePo } from '../modal/CreatePoModal';
import Images from '@assets/image/Images';
import { navigate } from '@/navigation/RootNavigation';
import { AppText } from '@/elements/text/AppText';
import { useCreatePoViewModel } from '../viewmodal/useCreatePoViewModal';
import ToastContainer from '@/elements/toast/ToastContainer';
import { Colors } from '@/theme/Config';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import IconPlus from '@assets/icon/IconPlus';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { styles } from './style';
import CreatePoCard from './component/CreatePoCard';
import { AppButton } from '@/elements/button/AppButton';

const CreatePoScreen: React.FC = () => {
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
    handleSelect,
  } = useCreatePoViewModel();
  const { infoUser } = useInfoUser();

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<TypeCreatePo> | null>(null);

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
  const onCreatePo = useCallback(() => navigate('CreatePoNccScreen'), []);

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
        <AppText style={styles.emptyText}>{t('CreatePo.empty')}</AppText>
        <AppBlockButton onPress={onCreatePo} style={styles.buttonCreatePo}>
          <IconPlus fill={Colors.WHITE} />
          <AppText style={styles.textCreatePo}>{t('CreatePo.CreatePo')}</AppText>
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
    ({ item }: { item: TypeCreatePo; index: number }) => (
      <CreatePoCard
        item={item}
        handleSelect={handleSelect}
        isSelected={selectedIds.includes(item.id)}
      />
    ),
    [handleSelect, selectedIds],
  );
  // console.log('render : ', length);
  const goToFilterScreen = useCallback(() => {
    navigate('FilterCreatePoScreen', {
      onApplyFilters: applyFilters, // Callback để FilterScreen gọi khi confirm
      currentFilters: currentFilters, // Filters hiện tại đang hiển thị trên màn hình A
    });
  }, [applyFilters, currentFilters]);

  console.log('CreatePoScreen', flatData);
  // ...existing code...
  // const navigation = useNavigation();

  // // Thêm useEffect để theo dõi length và update tabBar visibility
  // useEffect(() => {
  //   navigation.setOptions({
  //     tabBarStyle: {
  //       display: length > 0 ? 'none' : 'flex',
  //       // Giữ lại các style khác của tabBar nếu có
  //       backgroundColor: Colors.WHITE,
  //       borderTopWidth: 0,
  //       elevation: 0,
  //       shadowOpacity: 0,
  //     },
  //   });
  // }, [length, navigation]);

  if (isError || (isFirstLoad && !isLoading)) {
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
                  {t('CreatePo.title')}
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
          <AppText style={styles.titleText}>{t('CreatePo.supplierPriceList')}</AppText>
          <View style={styles.countBadge}>
            <AppText style={styles.countBadgeText}>{flatData.length}</AppText>
          </View>
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
        {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
        <AppBlockButton onPress={scrollToTop} style={[styles.scrollButtonBase]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AppBlockButton>
      </View>
      {length > 0 && (
        <View style={styles.buttonCreate}>
          <AppButton style={{ backgroundColor: Colors.PRIMARY }}>
            <AppText weight="bold" color={Colors.WHITE}>
              {t('myTabs.tab3')}
            </AppText>
          </AppButton>
        </View>
      )}
    </ViewContainer>
  );
};

export default CreatePoScreen;
