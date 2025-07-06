// views/AssignPriceScreen.tsx

import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { getFontSize } from '../../../constants';
// import {AppText} from '../../elements/text/AppText';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';

import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { DetailOrderApprove } from '../modal/DetailOrderApproveModal';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import ToastContainer from '@/elements/toast/ToastContainer';
import { AnimatedButton } from '@/screens/assignPriceScreen/view/AssignPriceScreen';
import { Colors } from '@/theme/Config';
import Header from '@/screens/notificationScreen/view/component/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '@/navigation/params';
import { goBack, navigate } from '@/navigation/RootNavigation';
import AppBlockButton from '@/elements/button/AppBlockButton';
import IconInfomation from '@assets/icon/IconInfomation';
import { useDetailOrderApproveViewModel } from '../viewmodal/useDetailOrderApproveViewModel';
import DetailOrderItemCard from './component/DetailOrderItemCard';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import Footer from '@/screens/filterScreen/view/component/Footer';
import { useApproveViewModel } from '@/screens/approvePrScreen/viewmodal/useApproveViewModel';
import { isAndroid } from '@/utils/Utilities';

const DetailOrderApproveScreen = ({
  route,
}: NativeStackScreenProps<MainParams, 'DetailOrderApproveScreen'>) => {
  const { t } = useTranslation();
  const refToast = useRef<any>(null);
  const { content, id } = route.params.item;

  // ─── ViewModel MVVM ──────────────────────────────────────────────────────────
  const {
    flatData,
    isLoading,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    hasNextPage,
    isError,
  } = useDetailOrderApproveViewModel(id);
  const { onReject, onApproved } = useApproveViewModel();

  // ─── Local state cho input tìm kiếm ─────────────────────────────────────────

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<DetailOrderApprove> | null>(null);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onEndReached = () => {
    if (!isLoading && !isFetchingNextPage && hasNextPage && !isFetching) {
      onLoadMore();
    }
  };
  const listEmptyComponent = () => {
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
        <AppText style={styles.emptyText}>{t('home.empty')}</AppText>
      </View>
    );
  };

  const listFooterComponent = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={light.primary} />
        </View>
      );
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: DetailOrderApprove; index: number }) => (
      <DetailOrderItemCard item={item} index={index} />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flatData],
  );
  console.log('data', flatData);
  const rightComponent = () => (
    <AppBlockButton
      style={styles.rightComponent}
      onPress={() =>
        navigate('DetailApproveCardScreen', {
          item: route.params?.item,
        })
      }>
      <IconInfomation fill={Colors.WHITE} />
    </AppBlockButton>
  );

  const reLoadData = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  console.log('error:', isError);
  if (isError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  return (
    <ViewContainer>
      <View style={styles.container}>
        <Header primary title={content} rightComponent={rightComponent()} />
        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('Thông tin các mặt hàng')}</AppText>
          <View style={styles.countBadge}>
            <AppText style={styles.countBadgeText}>{flatData.length}</AppText>
          </View>
        </View>
        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && flatData.length === 0 ? (
          <View style={styles.listContent}>
            {new Array(6).fill(0).map((_, index) => (
              <SkeletonItem key={index} showWaiting={index % 3 === 0} />
            ))}
          </View>
        ) : (
          <FlashList
            ref={flashListRef}
            // data={[]}
            data={flatData || []}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}-${item.price}`}
            // onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            removeClippedSubviews
            refreshing={isRefetching}
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
      {flatData && flatData.length > 0 && (
        <Footer
          onLeftAction={() => {
            onReject([id]);
            goBack();
          }}
          onRightAction={() => {
            onApproved([id]);
            goBack();
          }}
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

export default DetailOrderApproveScreen;

const styles = StyleSheet.create({
  rightComponent: {
    width: vs(40),
    height: vs(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    paddingVertical: vs(12),
  },
  titleText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: Colors.BLACK_900,
  },
  countBadge: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: s(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    marginLeft: s(8),
  },
  countBadgeText: {
    color: Colors.WHITE,
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: PaddingHorizontal,
    paddingBottom: vs(0),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: vs(100),
  },
  emptyText: {
    marginTop: vs(16),
    fontSize: getFontSize(14),
    color: Colors.BLACK_400,
  },
  footerLoading: {
    paddingVertical: vs(16),
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
