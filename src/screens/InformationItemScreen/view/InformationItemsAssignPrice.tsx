// views/AssignPriceScreen.tsx

import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { getFontSize } from '../../../constants';
// import {AppText} from '../../elements/text/AppText';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';

import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { IItemInDetailPr } from '../modal/InformationItemsModal';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
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

const InformationItemsAssignPrice = ({
  route,
}: NativeStackScreenProps<MainParams, 'InformationItemsAssignPrice'>) => {
  const { t } = useTranslation();
  // const refToast = useRef<any>(null);
  const { prNo, id } = route.params.item;

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
    onUpdateNCC,
    isError,
    onAutoAssign,
  } = useInformationItemsViewModel(id, prNo);
  // ─── Local state cho input tìm kiếm ─────────────────────────────────────────

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<IItemInDetailPr> | null>(null);

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = () => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
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
    ({ item, index }: { item: IItemInDetailPr; index: number }) => (
      <InformationItemsCard
        item={item}
        index={index}
        onUpdatePrice={onUpdatePrice}
        onUpdateNCC={onUpdateNCC}
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

  if (isError) {
    return <FallbackComponent resetError={reLoadData} />;
  }

  return (
    <ViewContainer>
      <View style={styles.container}>
        <Header primary title={prNo} rightComponent={rightComponent()} />
        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('orderDetail.title')}</AppText>
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
            scrollEventThrottle={16}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            estimatedItemSize={100}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
        <AppBlockButton onPress={scrollToTop} style={[styles.scrollBottomContainer]}>
          <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
        </AppBlockButton>
      </View>
      {flatData && flatData.length > 0 && (
        <FooterInformationItem id={id} prNo={prNo} onAutoAssign={onAutoAssign} />
      )}
    </ViewContainer>
  );
};

export default InformationItemsAssignPrice;

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
