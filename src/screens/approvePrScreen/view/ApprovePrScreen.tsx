// views/AssignPriceScreen.tsx

import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';

import { getFontSize } from '../../../constants';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';
import AppBlockButton from '../../../elements/button/AppBlockButton';

import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { IApprove } from '../modal/ApproveModal';
import { navigate } from '../../../navigation/RootNavigation';
import { AppText } from '@/elements/text/AppText';
import { useApproveViewModel } from '../viewmodal/useApproveViewModel';
import ToastContainer from '@/elements/toast/ToastContainer';
import { Colors } from '@/theme/Config';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import Footer from '@/screens/filterScreen/view/component/Footer';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import ApproveCard from './component/ApproveCard';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import { useStatusGlobal } from '@/zustand/store/useStatusGlobal/useStatusGlobal';
import HeaderSearch from '@/components/headerSearch/HeaderSearch';

export default function ApprovePrScreen() {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const refToast = useRef<any>(null);
  const route = useRoute() as any;
  // ─── ViewModel MVVM ──────────────────────────────────────────────────────────
  const {
    length,
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
    onApprovedNoChange,
    onApproved,
    selectedIds,
    setSelectedIds,
  } = useApproveViewModel();
  const { infoUser } = useInfoUser();

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<IApprove> | null>(null);

  // show Scroll‐to‐Top khi scroll lên (swipe xuống), 0 = hidden, 1 = visible

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
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
        <AppText style={styles.emptyText}>{t('approve.detail.empty')}</AppText>
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
  const { statusGlobal } = useStatusGlobal();
  console.log('alo: ', statusGlobal);
  const handleSelect = useCallback(
    (id: number) => {
      // setSelectedIds([id]);
      // setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
      setSelectedIds(prev => (prev.includes(id) ? [] : [id]));
    },
    [setSelectedIds],
  );

  // const toggleSelectAll = useCallback(() => {
  //   const allIds = flatData.map(item => item.id);
  //   if (selectedIds.length === flatData.length) {
  //     setSelectedIds([]); // Bỏ chọn tất cả
  //   } else {
  //     setSelectedIds(allIds); // Chọn tất cả
  //   }
  // }, [selectedIds.length, flatData, setSelectedIds]);

  const renderItem = useCallback(
    ({ item }: { item: IApprove; index: number }) => (
      <ApproveCard
        onApproved={onApproved}
        item={item}
        handleSelect={handleSelect}
        isSelected={selectedIds.includes(item.id)}
      />
    ),
    [handleSelect, onApproved, selectedIds],
  );

  // const selectedAll = useMemo(
  //   () => selectedIds.length === flatData.length && flatData.length > 0,
  //   [selectedIds.length, flatData.length],
  // );

  const goToFilterScreen = useCallback(() => {
    navigate('FilterApproveScreen', {
      onApplyFilters: applyFilters, // Callback để FilterScreen gọi khi confirm
      currentFilters: currentFilters, // Filters hiện tại đang hiển thị trên màn hình A
    });
  }, [applyFilters, currentFilters]);

  // const orderSelected = useMemo(() => selectedIds.length, [selectedIds]);

  if (isError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  return (
    <ViewContainer>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* ─── Background Image ─────────────────────────────────────────────── */}
        <HeaderSearch
          currentPrNoInput={currentPrNoInput}
          onSearch={onSearch}
          textPlaceholder={t('assignPrice.searchPlaceholder')}
          goToFilterScreen={goToFilterScreen}
        />

        {/* ─── Title + Count Badge ───────────────────────────────────────────── */}
        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('approve.listOfPurchaseOrder')}</AppText>
          <View style={styles.countBadge}>
            <AppText style={styles.countBadgeText}>{length}</AppText>
          </View>
        </View>
        {/* <View style={styles.header}>
          <AppBlockButton onPress={toggleSelectAll} style={styles.buttonCenter}>
            {selectedAll ? <IconCheckBox /> : <IconUnCheckBox />}
            <AppText style={styles.ml7}>{t('createPrice.pickAll')}</AppText>
          </AppBlockButton>
          <AppText>
            {orderSelected} {t('createPrice.orderSelected')}
          </AppText>
        </View> */}
        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && length === 0 ? (
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
            keyExtractor={item => item.id.toString()}
            onEndReached={onLoadMore}
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
      {selectedIds.length > 0 && (
        <Footer
          onLeftAction={() => navigate('ModalInputRejectApprove', { id: selectedIds[0] })}
          onRightAction={() => onApprovedNoChange(selectedIds)}
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
}

export const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(12),
    marginTop: vs(30),
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
    paddingTop: vs(12),
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
  containerFlashList: {
    backgroundColor: '#F2F3F5',
  },
});
