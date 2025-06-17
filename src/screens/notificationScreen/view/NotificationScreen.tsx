// views/NotificationScreen.tsx

import React, {useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInLeft,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {s, vs} from 'react-native-size-matters';

import {MainParams} from '../../../navigation/params';
import {AppBlock} from '../../../elements/block/Block';
import EmptyDataAnimation from '../../../views/animation/EmptyDataAnimation';
import IconScrollBottom from '../../../../assets/icon/IconScrollBottom';

import light from '../../../theme/light';
import {AnimatedButton} from '../../assignPriceScreen/view/AssignPriceScreen';
import {ContentNotification} from '../../../interface/Notification.interface';
import {useNotificationViewModel} from '../viewmodal/useNotificationViewModel';
import ItemNotification from './component/ItemNotification';
import Header from './component/Header';
import {AppText} from '@/elements/text/AppText';
import {FlashList} from '@shopify/flash-list';

type Props = NativeStackScreenProps<MainParams, 'NotificationScreen'>;

const NotificationScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();

  // ─── ViewModel (MVVM) ────────────────────────────────────────────────
  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
  } = useNotificationViewModel();

  // ─── Refs & shared values để show/hide nút cuộn ─────────────────────
  const lastOffsetY = useRef(0);
  const showScrollToTop = useSharedValue(0);
  const showScrollToBottom = useSharedValue(0);

  const opacityScrollTopStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToTop.value, {duration: 200}),
  }));
  const opacityScrollBottomStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showScrollToBottom.value, {duration: 200}),
  }));

  const flatListRef = useRef<FlashList<ContentNotification> | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    // Scroll xuống (y tăng) → show “scroll-to-bottom”, ẩn “scroll-to-top”
    if (y > lastOffsetY.current && y > 100) {
      showScrollToBottom.value = 1;
      showScrollToTop.value = 0;
    }
    // Scroll lên (y giảm) → show “scroll-to-top”, ẩn “scroll-to-bottom”
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
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
    showScrollToTop.value = 0;
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
    showScrollToBottom.value = 0;
  };

  // ─── Khi user nhấn vào 1 item, chuyển sang detail hoặc đánh dấu đã đọc ─────────────────
  const onDetail = (id: number) => {
    // TODO: navigation.navigate('NotificationDetail', { id })
    // hoặc gọi API đánh dấu item “id” thành read = true
  };

  const handleDelete = async (id: number) => {
    // TODO: gọi API xóa notification, rồi update listNotification
  };

  // ─── Render mỗi item, với animation FadeInLeft.delay(index * 50) ─────────────────
  const renderItem = ({
    item,
    index,
  }: {
    item: ContentNotification;
    index: number;
  }) => (
    <Animated.View entering={FadeInLeft.delay(index * 50)}>
      <ItemNotification
        item={item}
        onDetail={() => onDetail(item.id)}
        toggleRead={() => {
          // TODO: toggle read status local hoặc gọi API
        }}
        handleDelete={() => handleDelete(item.id)}
      />
    </Animated.View>
  );

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
        <AppText style={{marginTop: vs(8)}}>{t('Không có thông báo')}</AppText>
      </AppBlock>
    );
  };

  console.log('render màn notification: ', isLoading);
  return (
    <AppBlock flex>
      <Header onPressRight={() => {}} />
      {isLoading && !flatData ? (
        <ActivityIndicator
          size="large"
          color={light.primary}
          style={{flex: 1}}
        />
      ) : (
        <FlashList
          ref={flatListRef}
          data={flatData || []}
          keyExtractor={item => `${item.id}_${item.read}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={onRefresh}
          ListEmptyComponent={listEmptyComponent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={light.primary} />
              </View>
            ) : null
          }
          contentContainerStyle={{flexGrow: 1, paddingBottom: vs(50)}}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}

      <AnimatedButton
        onPress={scrollToTop}
        style={[styles.scrollTopContainer, opacityScrollTopStyle]}>
        <IconScrollBottom style={{transform: [{rotate: '180deg'}]}} />
      </AnimatedButton>
      <AnimatedButton
        onPress={scrollToBottom}
        style={[styles.scrollBottomContainer, opacityScrollBottomStyle]}>
        <IconScrollBottom />
      </AnimatedButton>
    </AppBlock>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },
  scrollButtonContainerTop: {
    position: 'absolute',
    bottom: vs(80),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scrollButtonContainerBottom: {
    position: 'absolute',
    bottom: vs(20),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  emptyContainer: {
    flex: 1,
    marginTop: vs(40),
    justifyContent: 'center',
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
  scrollButton: {
    backgroundColor: light.primary,
    borderRadius: s(25),
    width: s(50),
    height: s(50),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
