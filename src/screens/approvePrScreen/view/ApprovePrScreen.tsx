import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  FadeInLeft,
} from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { getFontSize, SCREEN_WIDTH } from '../../../constants';
import { PaddingHorizontal } from '../../../utils/Constans';
import light from '../../../theme/light';
import AppBlockButton from '../../../elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import { AnimatedButton } from '@/screens/assignPriceScreen/view/AssignPriceScreen';
import Footer from '@/screens/filterScreen/view/component/Footer';
import { Colors } from '@/theme/Config';
import ToastContainer from '@/elements/toast/ToastContainer';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';

import IconNotification from '../../../../assets/icon/IconNotification';
import IconSearch from '../../../../assets/icon/IconSearch';
import IconFilter from '../../../../assets/icon/IconFillter';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';
import Images from '../../../../assets/image/Images';

import { TypeApprove } from '../modal/ApproveModal';
import { useApproveViewModel } from '../viewmodal/useApproveViewModel';
import ApproveCard from './component/ApproveCard';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { navigate } from '../../../navigation/RootNavigation';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';

// Constants
const BOTTOM_HEIGHT = vs(120);
const BOTTOM_LOW = vs(20);
const ANIMATION_DURATION = 300;
const SCROLL_THRESHOLD = 100;

const ApprovePrScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { infoUser } = useInfoUser();

  // Refs
  const refToast = useRef<any>(null);
  const flashListRef = useRef<FlashList<TypeApprove> | null>(null);
  const lastOffsetY = useRef<number>(0);

  // State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Shared values for animations
  const showScrollToTop = useSharedValue<number>(0);
  const showScrollToBottom = useSharedValue<number>(0);
  const footerVisible = useSharedValue<number>(0);

  // ViewModel
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

  // Update footer visibility when selectedIds changes
  useDerivedValue(
    () =>
      (footerVisible.value = withTiming(selectedIds.length > 0 ? 1 : 0, {
        duration: ANIMATION_DURATION / 10,
      })),
    [selectedIds.length],
  );

  // Animated styles
  const opacityScrollTopStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToTop.value, { duration: 200 }),
  }));

  const opacityScrollBottomStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToBottom.value, { duration: 200 }),
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(footerVisible.value === 1 ? 0 : 100, {
          duration: ANIMATION_DURATION,
        }),
      },
    ],
    opacity: withTiming(footerVisible.value, { duration: ANIMATION_DURATION }),
  }));

  const positionScrollStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    alignSelf: 'center' as const,
    bottom: footerVisible.value === 1 ? BOTTOM_HEIGHT : BOTTOM_LOW,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }));

  // Scroll handlers
  const scrollToTop = () => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    showScrollToTop.value = 0;
  };

  const scrollToBottom = () => {
    flashListRef.current?.scrollToEnd({ animated: true });
    showScrollToBottom.value = 0;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    if (y > lastOffsetY.current && y > SCROLL_THRESHOLD) {
      showScrollToBottom.value = 1;
      showScrollToTop.value = 0;
    } else if (y < lastOffsetY.current && y > SCROLL_THRESHOLD) {
      showScrollToTop.value = 1;
      showScrollToBottom.value = 0;
    } else {
      showScrollToTop.value = 0;
      showScrollToBottom.value = 0;
    }
    lastOffsetY.current = y;
  };

  // Navigation handlers
  const goToNotification = () => navigate('NotificationScreen');
  const goToAccount = () => navigate('AccountScreen');
  const handleSubmitSearch = () => navigate('FilterScreen');

  // Selection handler
  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  }, []);

  // Render functions
  const renderItem = useCallback(
    ({ item, index }: { item: TypeApprove; index: number }) => {
      const isSelected = selectedIds.includes(item.id);
      return (
        <Animated.View
          entering={FadeInLeft.delay(index * 10)
            .duration(0)
            .springify()}>
          <ApproveCard
            item={item}
            index={index}
            isSelected={isSelected}
            handleSelect={handleSelect}
          />
        </Animated.View>
      );
    },
    [handleSelect, selectedIds],
  );

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
  const toggleSelectAll = () => {
    const allIds = flatData.map(item => item.id);
    if (selectedIds.length === flatData.length) {
      setSelectedIds([]); // Bỏ chọn tất cả
    } else {
      setSelectedIds(allIds); // Chọn tất cả
    }
  };

  const selectedAll = useMemo(
    () => selectedIds.length === flatData.length && flatData.length > 0,
    [selectedIds, flatData],
  );
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <FastImage
        style={styles.backgroundImage}
        source={Images.BackgroundAssignPrice}
        resizeMode={FastImage.resizeMode.cover}
      />

      {/* Header */}
      <View style={[styles.headerContainer, { marginTop: top }]}>
        <View style={styles.headerLeft}>
          <AppBlockButton onPress={goToAccount}>
            <FastImage source={{ uri: infoUser.profile.avatar }} style={styles.avatar} />
          </AppBlockButton>
          <View style={styles.greetingContainer}>
            <AppText color="#FFFFFF" style={styles.greetingText}>
              {t('approve.title')}
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSearch width={vs(18)} />
        <TextInput
          value={searchKey}
          onChangeText={onSearch}
          placeholder={t('approve.searchPlaceholder')}
          placeholderTextColor={light.placeholderTextColor}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={handleSubmitSearch}
        />
        <AppBlockButton style={styles.filterButton} onPress={handleSubmitSearch}>
          <IconFilter />
        </AppBlockButton>
      </View>

      {/* Title + Count Badge */}
      <View style={styles.titleContainer}>
        <AppText style={styles.titleText}>{t('approve.listOfPurchaseOrder')}</AppText>
        <View style={styles.countBadge}>
          <AppText style={styles.countBadgeText}>{flatData.length}</AppText>
        </View>
      </View>

      <View style={styles.header}>
        <AppBlockButton onPress={toggleSelectAll} style={styles.buttonCenter}>
          {selectedAll ? <IconCheckBox /> : <IconUnCheckBox />}
          <AppText style={styles.ml7}>{t('approve.selectAll')}</AppText>
        </AppBlockButton>
        <AppText>
          {selectedIds.length} {t('approve.orderSelected')}
        </AppText>
      </View>

      {/* FlashList */}
      <FlashList
        ref={flashListRef}
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
        contentContainerStyle={
          selectedIds.length > 0 ? styles.listContent : styles.listContentNoFooter
        }
      />

      {/* Toast Container */}
      <ToastContainer ref={refToast} />

      {/* Scroll Buttons */}
      <AnimatedButton onPress={scrollToTop} style={[positionScrollStyle, opacityScrollTopStyle]}>
        <IconScrollBottom style={{ transform: [{ rotate: '180deg' }] }} />
      </AnimatedButton>

      {!isFetchingNextPage && (
        <AnimatedButton
          onPress={scrollToBottom}
          style={[positionScrollStyle, opacityScrollBottomStyle]}>
          <IconScrollBottom />
        </AnimatedButton>
      )}

      {/* Footer with slide-up animation */}
      <Animated.View style={[styles.footerContainer, footerAnimatedStyle]}>
        <Footer
          leftButtonTitle={t('approve.reject')}
          rightButtonTitle={t('approve.approve')}
          leftButtonStyle={{ backgroundColor: Colors.ERROR_600 }}
          leftTextStyle={{ color: Colors.WHITE }}
        />
      </Animated.View>
    </View>
  );
};

export default ApprovePrScreen;

const styles = StyleSheet.create({
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ml7: { marginLeft: s(7) },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: vs(16),
    paddingHorizontal: s(16),
    // borderBottomWidth: 1,
  },
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
  listContentNoFooter: {
    paddingHorizontal: PaddingHorizontal,
    paddingBottom: vs(16),
  },
  listContent: {
    paddingHorizontal: PaddingHorizontal,
    paddingBottom: vs(100),
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
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
