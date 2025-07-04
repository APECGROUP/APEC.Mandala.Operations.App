// views/NotificationScreen.tsx

import React, { useRef, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';

import { MainParams } from '../../../navigation/params';
import { AppBlock } from '../../../elements/block/Block';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import light from '../../../theme/light';
import { AnimatedButton } from '../../assignPriceScreen/view/AssignPriceScreen';
import { ContentNotification } from '../modal/notificationModel';
import { useNotificationViewModel } from '../viewmodal/useNotificationViewModel';
import ItemNotification from './component/ItemNotification';
import Header from './component/Header';
import { AppText } from '@/elements/text/AppText';
import { FlashList } from '@shopify/flash-list';
import IconSeeAll from '@assets/icon/IconSeeAll';
import { getFontSize } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { isAndroid } from '@/utils/Utilities';
import { navigate } from '@/navigation/RootNavigation';

type Props = NativeStackScreenProps<MainParams, 'NotificationScreen'>;
const totalNotification = 100; // Hoặc truyền từ props nếu dynamic
const ICON_SECTION_WIDTH = s(130);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  // ─── ViewModel (MVVM) ────────────────────────────────────────────────

  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    isError,
    onDetail,
    readAll,
  } = useNotificationViewModel();

  // ─── Refs & shared values để show/hide nút cuộn ─────────────────────
  const lastOffsetY = useRef(0);
  const showScrollToTop = useSharedValue(0);
  const showScrollToBottom = useSharedValue(0);

  const opacityScrollTopStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToTop.value, { duration: 200 }),
  }));
  const opacityScrollBottomStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToBottom.value, { duration: 200 }),
  }));

  const flatListRef = useRef<FlashList<ContentNotification> | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    // Scroll xuống (y tăng) → show "scroll-to-bottom", ẩn "scroll-to-top"
    if (y > lastOffsetY.current && y > 100) {
      showScrollToBottom.value = 1;
      showScrollToTop.value = 0;
    }
    // Scroll lên (y giảm) → show "scroll-to-top", ẩn "scroll-to-bottom"
    else if (y < lastOffsetY.current && y > 100) {
      showScrollToTop.value = 1;
      showScrollToBottom.value = 0;
    } else {
      // Nếu y <= 100, ẩn cả 2
      showScrollToTop.value = 0;
      showScrollToBottom.value = 0;
    }

    lastOffsetY.current = y;
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    showScrollToTop.value = 0;
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    showScrollToBottom.value = 0;
  };

  // ─── Khi user nhấn vào 1 item, chuyển sang detail hoặc đánh dấu đã đọc ─────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: number) => {
    // TODO: gọi API xóa notification, rồi update listNotification
  };

  // ─── Render mỗi item, với animation FadeInLeft.delay(index * 50) ─────────────────
  const renderItem = ({ item }: { item: ContentNotification }) => (
    <ItemNotification
      item={item}
      onDetail={() => {
        if (!item.read) {
          onDetail(item.id);
        }
        navigate('DetailAssignPriceCardScreen', { item });
      }}
      toggleRead={() => {
        // TODO: toggle read status local hoặc gọi API
      }}
      handleDelete={() => handleDelete(item.id)}
    />
  );
  console.log('renderItem', flatData);
  // ─── Component khi list trống **và** đang không load trang >0 ─────────────
  const listEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={light.primary} />
        </View>
      );
    }
    return (
      <AppBlock flex center>
        <EmptyDataAnimation autoPlay />
        <AppText style={{ marginTop: vs(8) }}>{t('Không có thông báo')}</AppText>
      </AppBlock>
    );
  };

  const formatNotificationCount = (count: number) => {
    if (!count || count <= 0) return '';
    if (count > 99) return '99+';
    return count < 10 ? `0${count}` : `${count}`;
  };
  const notificationLabel = formatNotificationCount(totalNotification);

  const rightComponent = () => (
    <TouchableOpacity style={styles.rightButton} onPress={readAll}>
      <IconSeeAll />
      <AppText numberOfLines={1} style={styles.rightText}>
        {t('Đọc tất cả')}
        {notificationLabel ? ` (${notificationLabel})` : ''}
      </AppText>
    </TouchableOpacity>
  );

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
  console.log('error:', isError, flatData);
  if (isError) {
    return <FallbackComponent resetError={onRefresh} />;
  }

  return (
    <ViewContainer>
      <AppBlock flex>
        <Header rightComponent={rightComponent()} iconWidth={s(130)} />

        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && flatData.length === 0 ? (
          <View style={styles.listContentSkeleton}>
            {new Array(6).fill(0).map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </View>
        ) : (
          <FlashList
            ref={flatListRef}
            data={flatData || []}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}_${item.read}`}
            // extraData={flatData.map(item => item.read).join(',')}
            onEndReached={onLoadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            removeClippedSubviews
            refreshing={isRefetching}
            onRefresh={onRefresh}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            // estimatedItemSize={100}
            contentContainerStyle={styles.listContent}
          />
        )}

        <AnimatedButton
          onPress={scrollToTop}
          style={[
            styles.scrollButtonBase,
            isAndroid() && { bottom: vs(100) },
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
      </AppBlock>
    </ViewContainer>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  rightButton: {
    width: ICON_SECTION_WIDTH,
    height: vs(40),
    flexDirection: 'row',
    paddingRight: PaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightText: {
    fontSize: getFontSize(12),
    marginLeft: s(4),
    fontWeight: '500',
    color: light.primary,
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
    bottom: vs(70),
  },
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },
  emptyContainer: {
    flex: 1,
    marginTop: vs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: vs(50),
  },
  listContentSkeleton: {
    flexGrow: 1,
    paddingBottom: vs(50),
    paddingHorizontal: PaddingHorizontal,
  },
});
