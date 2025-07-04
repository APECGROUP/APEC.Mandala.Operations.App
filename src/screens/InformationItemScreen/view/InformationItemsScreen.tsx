// views/AssignPriceScreen.tsx

import React, { useRef, useCallback, useState } from 'react';
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

import { DataInformationItems } from '../modal/InformationItemsModal';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import ToastContainer from '@/elements/toast/ToastContainer';
import { AnimatedButton } from '@/screens/assignPriceScreen/view/AssignPriceScreen';
import { useInformationItemsViewModel } from '../viewmodal/useInformationItemsViewModel';
import InformationItemsCard from './component/InformationItemsCard';
import { Colors } from '@/theme/Config';
import FooterInformationItem from './FooterInformationItem';
import Header from '@/screens/notificationScreen/view/component/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '@/navigation/params';
import { navigate } from '@/navigation/RootNavigation';
import AppBlockButton from '@/elements/button/AppBlockButton';
import IconInfomation from '@assets/icon/IconInfomation';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { isAndroid } from '@/utils/Utilities';

const InformationItemsScreen = ({
  route,
}: NativeStackScreenProps<MainParams, 'InformationItemsScreen'>) => {
  const { t } = useTranslation();
  const refToast = useRef<any>(null);
  const { content } = route.params.item;
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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
    onUpdatePrice,
    isError,
    onAutoAssign,
  } = useInformationItemsViewModel();

  // ─── Local state cho input tìm kiếm ─────────────────────────────────────────

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<DataInformationItems> | null>(null);
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
    ({ item, index }: { item: DataInformationItems; index: number }) => (
      <InformationItemsCard
        item={item}
        index={index}
        onUpdatePrice={onUpdatePrice}
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
    [flatData, onUpdatePrice],
  );

  const rightComponent = () => (
    <AppBlockButton
      style={styles.rightComponent}
      onPress={() =>
        navigate('DetailAssignPriceCardScreen', {
          item: route.params?.item,
        })
      }>
      <IconInfomation fill={Colors.WHITE} />
    </AppBlockButton>
  );

  const reLoadData = useCallback(() => {
    setIsFirstLoad(false);
    onRefresh();
  }, [onRefresh]);

  // const handleAutoAssign = () => {
  //   const newItems = items.map(item => ({
  //     ...item,
  //     price: Math.floor(Math.random() * 10 + 1) * 1000, // random 1000-10000
  //     ncc: 'NCC_' + Math.floor(Math.random() * 100), // ví dụ NCC random
  //   }));
  //   setItems(newItems);
  // };

  console.log('error:', isError);
  if (isError || (isFirstLoad && !isLoading)) {
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
            onEndReached={onEndReached}
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
            styles.scrollBottomContainer,
            isAndroid() && { bottom: vs(50) },
            opacityScrollTopStyle,
          ]}>
          <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
        </AnimatedButton>
        {!isFetchingNextPage && (
          <AnimatedButton
            onPress={scrollToBottom}
            style={[styles.scrollBottomContainer, opacityScrollBottomStyle]}>
            {/* style={[styles.scrollButtonContainer, opacityScrollBottomStyle]}> */}
            <IconScrollBottom />
          </AnimatedButton>
        )}
      </View>
      {flatData && flatData.length > 0 && <FooterInformationItem onAutoAssign={onAutoAssign} />}
    </ViewContainer>
  );
};

export default InformationItemsScreen;

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
    paddingBottom: vs(100),
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
  scrollBottomContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: vs(30),
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
});
