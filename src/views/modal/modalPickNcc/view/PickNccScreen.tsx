import React, { useCallback, useLayoutEffect } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '../../../../navigation/params';
import { AppBlock } from '../../../../elements/block/Block';
import { AppText } from '../../../../elements/text/AppText';
import light from '../../../../theme/light';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import IconClose from '../../../../../assets/icon/IconClose';
import { PaddingHorizontal } from '../../../../utils/Constans';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import IconSelectHotel from '../../../../../assets/icon/IconSelectHotel';
import { usePickNCCViewModel } from '../viewmodal/usePickNCCViewModel';
import { SCREEN_HEIGHT } from '@/constants';
import { FlashList } from '@shopify/flash-list';
import { IItemSupplier } from '../modal/PickNccModal';
import AppInputSearch from '@/elements/textInput/AppInputSearch';
import { Colors } from '@/theme/Config';
import IconEmptyNcc from '@assets/icon/IconEmptyNcc';
import { goBack } from '@/navigation/RootNavigation';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';

type Props = NativeStackScreenProps<MainParams, 'PickNccScreen'>;
const PickNccScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { setNcc, ncc } = route.params;
  const { bottom } = useSafeAreaInsets();

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
  } = usePickNCCViewModel();

  const listFooterComponent = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={light.primary} />
        </View>
      );
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
        <IconEmptyNcc />
        <AppText size={18} weight="700" mt={12}>
          {t('orderDetail.empty')}
        </AppText>
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item, index }: { item: IItemSupplier; index: number }) => {
      const isFocus = item?.id === ncc?.id;
      const onSelect = () => {
        setNcc(item);
        navigation.goBack();
      };
      return (
        <AppBlockButton
          key={index}
          onPress={onSelect}
          style={[isFocus ? styles.itemFocus : { padding: vs(10) }]}>
          <AppText weight="500">{item.invoiceName}</AppText>
          {isFocus && <IconSelectHotel />}
        </AppBlockButton>
      );
    },
    [navigation, ncc?.id, setNcc],
  );

  const translateY = useSharedValue(700);

  const onShow = useCallback(() => {
    translateY.value = withTiming(0, {
      duration: 200,
    });
  }, [translateY]);

  const onHidden = useCallback(
    (func?: () => void) => {
      translateY.value = withTiming(
        700,
        {
          duration: 200,
        },
        finished => {
          if (finished && func) {
            runOnJS(func)();
          }
        },
      );
    },
    [translateY],
  );
  const onGoBack = useCallback(() => {
    onHidden(goBack);
  }, [onHidden]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  useLayoutEffect(() => {
    onShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onGoBack}>
      <AnimatedButton
        activeOpacity={1}
        onPress={() => {}}
        style={[
          styles.container,
          { paddingBottom: bottom || vs(10), height: SCREEN_HEIGHT * 0.7 },
          animatedStyle,
        ]}>
        <AppBlock
          pl={PaddingHorizontal}
          row
          justifyContent="space-between"
          alignItems="center"
          style={styles.width1}>
          <AppText size={20} weight="bold">
            {t('orderDetail.titleSearch')}
          </AppText>
          <TouchableOpacity onPress={onGoBack} style={{ padding: PaddingHorizontal }}>
            <IconClose />
          </TouchableOpacity>
        </AppBlock>

        <View style={{ paddingHorizontal: PaddingHorizontal }}>
          <AppText mt={10} mb={6} weight="700">
            {t('filter.supplier')}
          </AppText>
          <AppInputSearch
            fill={searchKey ? Colors.PRIMARY : '#BABABA'}
            showIconRemove
            containerStyle={styles.conatinerInputSearch}
            value={searchKey}
            onChangeText={onSearch}
            placeholder={t('filter.search')}
          />
        </View>

        <FlashList
          data={flatData || []}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString() || ''}
          onEndReached={onLoadMore}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          refreshing={isRefetching}
          onRefresh={onRefresh}
          scrollEventThrottle={16}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={listFooterComponent}
          contentContainerStyle={{
            paddingHorizontal: PaddingHorizontal,
            paddingBottom: bottom || vs(10),
            paddingTop: vs(10),
          }}
        />
      </AnimatedButton>
    </TouchableOpacity>
  );
};

export default PickNccScreen;

const styles = StyleSheet.create({
  width1: { borderBottomWidth: 1, borderBottomColor: light.border },
  conatinerInputSearch: {
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: Colors.BLACK_100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },
  itemFocus: {
    backgroundColor: light.selected,
    padding: vs(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopRightRadius: s(8),
    borderTopLeftRadius: s(8),
    backgroundColor: light.white,
  },
});
