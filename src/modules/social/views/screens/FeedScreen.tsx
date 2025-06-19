import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import PostItem from '../components/PostItem';
import PostSkeleton from '../components/PostSkeleton';
import { usePostViewModel } from '../../viewmodals/assignPrice/usePostViewModel';
import { scale, verticalScale, vs } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Post } from '../../models/Post';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfoUser } from '../../../../zustand/store/useInfoUser/useInfoUser';
import { SCREEN_WIDTH } from '../../../../constants';
import AppImage from '../../../../elements/appImage/AppImage';
import { AppText } from '../../../../elements/text/AppText';
import light from '../../../../theme/light';
import AppLoadingScreen, {
  AppLoadingScreenRef,
} from '../../../../views/animation/AppLoadingScreen';
// Constants
const HEADER_HEIGHT = verticalScale(100); // Cố định height header

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 17) return 'Chào buổi chiều';
  if (hour < 20) return 'Chào buổi tối';
  return 'Chúc ngủ ngon';
};

const FeedScreen = ({
  onScrollDirectionChange,
}: {
  onScrollDirectionChange: (direction: 'up' | 'down') => void;
}) => {
  const { posts, isLoading, refreshing, loadingMore, refreshPosts, loadMorePosts } =
    usePostViewModel();

  const { top } = useSafeAreaInsets();
  const { infoUser } = useInfoUser();

  const loadingRef = useRef<AppLoadingScreenRef>(null);
  const flatListRef = useRef<FlashList<Post>>(null);
  const lastOffsetY = useRef(0);
  const showScrollButton = useSharedValue(0);
  const showHeader = useSharedValue(1);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollButton.value, { duration: 200 }),
  }));
  const opacityHeaderStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showHeader.value, { duration: 100 }),
  }));

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    showScrollButton.value = 0;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    showScrollButton.value = y > 500 ? 1 : 0;

    if (y > 20) {
      const direction = y > lastOffsetY.current ? 'down' : 'up';
      showHeader.value = y > lastOffsetY.current ? 0 : 1;
      lastOffsetY.current = y;

      onScrollDirectionChange(direction);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) =>
      isLoading ? (
        <PostSkeleton />
      ) : (
        <PostItem
          item={item}
          onFocusComment={() => {
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.1, // 0 = top, 0.5 = center, 1 = bottom
            });
          }}
        />
      ),
    [isLoading],
  );

  const keyExtractor = useCallback(
    (item: Post, index: number) => item?.id?.toString() || index.toString(),
    [],
  );

  useEffect(() => {
    if (isLoading) {
      loadingRef.current?.show();
    } else {
      loadingRef.current?.hide(); // Hiện loading
    }
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.root, opacityHeaderStyle]}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: scale(20),
            borderRadius: 30,
            paddingTop: top,
            height: HEADER_HEIGHT,
            zIndex: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
          <AppImage
            source={{
              uri: infoUser?.profile?.avatar || 'https://via.placeholder.com/150',
            }}
            style={{ height: vs(30), width: vs(30), borderRadius: vs(30) }}
          />
          <View style={styles.containerFlex}>
            <AppText weight="medium" size={14} color="#888">
              {getGreeting()}
            </AppText>
            <AppText weight="bold" size={18} numberOfLines={1}>
              {infoUser?.profile?.fullName}
            </AppText>
          </View>
        </View>
      </Animated.View>
      <FlashList
        ref={flatListRef}
        data={isLoading ? Array.from({ length: 10 }) : posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={verticalScale(300)}
        initialNumToRender={5}
        windowSize={5}
        onRefresh={isLoading ? undefined : refreshPosts}
        refreshing={refreshing}
        onEndReached={isLoading ? undefined : loadMorePosts}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          loadingMore && !isLoading ? <ActivityIndicator style={styles.loadingMore} /> : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Scroll to Top */}
      <Animated.View style={[styles.scrollToTopButton, opacityStyle]}>
        <TouchableOpacity onPress={scrollToTop} activeOpacity={0.8}>
          <Icon name="arrow-up-circle" size={scale(36)} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>
      <AppLoadingScreen ref={loadingRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    marginLeft: scale(12),
  },
  root: {
    height: HEADER_HEIGHT,
    backgroundColor: light.transparent,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    zIndex: 100,
  },
  container: {
    flex: 1,
  },
  loadingMore: {
    marginVertical: verticalScale(16),
  },
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
    paddingBottom: verticalScale(60),
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: verticalScale(50),
    right: scale(20),
    backgroundColor: '#fff',
    borderRadius: scale(50),
    padding: scale(6),
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default memo(FeedScreen);
