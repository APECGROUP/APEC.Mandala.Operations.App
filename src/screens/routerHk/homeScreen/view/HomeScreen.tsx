import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { Colors } from '@/theme/Config';
import HeaderHome from './component/HeaderHome';
import { FlashList } from '@shopify/flash-list';
import { AppText } from '@/elements/text/AppText';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import { vs } from 'react-native-size-matters';
import { getFontSize } from '@/constants';
import AppBlockButton from '@/elements/button/AppBlockButton';
import IconScrollBottom from '@assets/icon/IconScrollBottom';
import { FloorData } from '../modal/HomeModal';
import { useHomeViewModal } from '../viewmodal/useHomeViewModal';
import ItemHome from './component/ItemHome';
import ButtonBottomHome from './component/ButtonBottomHome';
import SkeletonItemHome from './component/SkeletonItemHome';

const HomeScreen = () => {
  const { data, isLoading, isRefetching, onLoadMore, onRefresh, isFetchingNextPage } =
    useHomeViewModal();
  const flashListRef = useRef<FlashList<FloorData> | null>(null);

  // ─── Hàm scrollToTop và scrollToBottom ───────────────────────────────────
  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);
  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      // Nếu đang loading và chưa có dữ liệu, hiển thị skeleton hoặc indicator
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      );
    }
    // Nếu không loading và không có dữ liệu, hiển thị EmptyDataAnimation.
    // Dữ liệu chỉ thực sự rỗng khi isLoading là false và flatData.length là 0.
    if (!isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyDataAnimation autoPlay />
          <AppText style={styles.emptyText}>{'Không có dữ liệu'}</AppText>
        </View>
      );
    }
    return null;
  }, [isLoading]);

  const listFooterComponent = useMemo(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={Colors.PRIMARY} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item, index }: { item: FloorData; index: number }) => <ItemHome index={index} item={item} />,
    [],
  );
  console.log('home: ', data);
  return (
    <ViewContainer>
      <SafeAreaView style={styles.safeArea}>
        <HeaderHome />
        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}

        {isLoading && data.length === 0 ? (
          <SkeletonItemHome />
        ) : (
          <FlashList
            ref={flashListRef}
            data={data} // Sử dụng flatData từ ViewModel
            renderItem={renderItem as any}
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
            style={styles.styleFlatList}
          />
        )}
        <AppBlockButton onPress={scrollToTop} style={[styles.scrollButtonBase]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AppBlockButton>
        <ButtonBottomHome />
      </SafeAreaView>
    </ViewContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  listContent: {
    paddingBottom: vs(100),
  },
  emptyContainer: {
    flex: 1,
    marginTop: vs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
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
    backgroundColor: Colors.WHITE, // Màu nền
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    bottom: vs(70),
  },
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },
  styleFlatList: {
    backgroundColor: '#E0E0E0',
  },
});
