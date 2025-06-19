import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { getFontSize, SCREEN_WIDTH } from '../../../constants';
// import {AppText} from '../../elements/text/AppText';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';
import AppBlockButton from '../../../elements/button/AppBlockButton';

import IconNotification from '../../../../assets/icon/IconNotification';
import IconSearch from '../../../../assets/icon/IconSearch';
import IconFilter from '../../../../assets/icon/IconFillter';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import { TypeApprove } from '../modal/ApproveModal';
import Images from '../../../../assets/image/Images';
import { navigate } from '../../../navigation/RootNavigation';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import { AppText } from '@/elements/text/AppText';
import { useApproveViewModel } from '../viewmodal/useApproveViewModel';
import ToastContainer from '@/elements/toast/ToastContainer';
import AssignPriceCard from '@/screens/assignPriceScreen/view/component/AssignPriceCard';

const AssignPriceScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  const refToast = useRef<any>(null);

  // ─── ViewModel MVVM ──────────────────────────────────────────────────────────
  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    onSearch,
    searchKey,
  } = useApproveViewModel();

  // ─── Refs và shared values Reanimated ───────────────────────────────────────
  const flashListRef = useRef<FlashList<TypeApprove> | null>(null);
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

  // ─── Khi bấm "Tìm kiếm" (submit) hoặc nút "Filter" ───────────────────────
  const handleSubmitSearch = () => {
    // Gọi onSearch của ViewModel để cập nhật searchKey → trigger loadPage(1, key)
    // scrollToTop();
    // onSearch(inputKey.trim());
    navigate('FilterScreen');
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
        <AppText style={styles.emptyText}>{t('assignPrice.empty')}</AppText>
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

  const goToNotification = () => navigate('NotificationScreen');

  const renderItem = useCallback(
    ({ item, index }: { item: TypeApprove; index: number }) => (
      <AssignPriceCard item={item} index={index} />
    ),
    [],
  );

  const goToAccount = () => navigate('AccountScreen');
  return (
    <View style={styles.container}>
      {/* ─── Background Image ─────────────────────────────────────────────── */}
      <FastImage
        style={styles.backgroundImage}
        source={Images.BackgroundAssignPrice}
        resizeMode={FastImage.resizeMode.cover}
      />
      {/* ─── Header (không animate ẩn/hiện trong ví dụ này) ──────────────────── */}
      <View style={[styles.headerContainer, { marginTop: top }]}>
        <View style={styles.headerLeft}>
          <AppBlockButton onPress={goToAccount}>
            <FastImage
              source={{
                uri: 'https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/depositphotos13895290xl-1713863023175.jpg',
              }}
              style={styles.avatar}
            />
          </AppBlockButton>

          <View style={styles.greetingContainer}>
            <AppText color="#FFFFFF" style={styles.greetingText}>
              {t('assignPrice.title')}
            </AppText>
            <AppText color="#FFFFFF" style={styles.greetingText}>
              {t(' Vũ Linh')}
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
          value={searchKey}
          onChangeText={onSearch}
          placeholder={t('assignPrice.searchPlaceholder')}
          placeholderTextColor={light.placeholderTextColor}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
        <AppBlockButton style={styles.filterButton} onPress={handleSubmitSearch}>
          <IconFilter />
        </AppBlockButton>
      </View>

      {/* ─── Title + Count Badge ───────────────────────────────────────────── */}
      <View style={styles.titleContainer}>
        <AppText style={styles.titleText}>{t('Danh sách gán giá NCC')}</AppText>
        <View style={styles.countBadge}>
          <AppText style={styles.countBadgeText}>{flatData.length}</AppText>
        </View>
      </View>
      {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}

      <FlashList
        ref={flashListRef}
        // data={[]}
        data={flatData || []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
        estimatedItemSize={100}
        contentContainerStyle={styles.listContent}
      />

      <ToastContainer ref={refToast} />

      {/* ─── Scroll‐To‐Top Button (hiện khi scroll lên) ────────────────────── */}
      <AnimatedButton
        onPress={scrollToTop}
        style={[styles.scrollTopContainer, opacityScrollTopStyle]}>
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
  );
};

export default AssignPriceScreen;
export const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    aspectRatio: 2.66,
    position: 'absolute',
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1,
    borderColor: light.white,
    height: vs(40),
    aspectRatio: 1,
    borderRadius: vs(20),
    marginRight: s(8),
  },
  greetingContainer: {
    height: vs(40),
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationWrapper: {
    width: vs(32),
    height: vs(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    borderWidth: 0.5,
    borderColor: light.white,
    position: 'absolute',
    top: vs(2),
    right: s(0),
    backgroundColor: '#FF3B30',
    width: vs(16),
    height: vs(16),
    borderRadius: vs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(8),
    fontWeight: '500',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(12),
    backgroundColor: light.white,
    borderRadius: s(8),
    paddingLeft: s(12),
    height: vs(46),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(12),
    fontWeight: '500',
    paddingVertical: 0,
    paddingLeft: s(6),
  },
  filterButton: {
    borderLeftWidth: 0.3,
    borderLeftColor: '#BABABA',
    height: vs(46),
    width: vs(46),
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(16),
    marginBottom: vs(16),
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
  },
  emptyContainer: {
    flex: 1,
    marginTop: vs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(14),
    color: '#666666',
  },
  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },

  scrollBottomContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: vs(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  scrollTopContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: vs(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
