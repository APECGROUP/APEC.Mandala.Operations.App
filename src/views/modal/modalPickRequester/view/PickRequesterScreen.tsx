import React, { useCallback } from 'react';
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRequesterViewModel } from '../viewmodal/useRequesterViewModel';
import { SCREEN_HEIGHT } from '@/constants';
import { FlashList } from '@shopify/flash-list';
import { IPickRequester } from '../modal/PickRequesterModal';
import AppInputSearch from '@/elements/textInput/AppInputSearch';
import { Colors } from '@/theme/Config';
import IconEmptyNcc from '@assets/icon/IconEmptyNcc';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

type Props = NativeStackScreenProps<MainParams, 'PickRequesterScreen'>;
const PickRequesterScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { requester, setRequester } = route.params;
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
  } = useRequesterViewModel();

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
          {t('filter.emptyRequester')}
        </AppText>
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item, index }: { item: IPickRequester; index: number }) => {
      const isFocus = item?.id === requester?.id;
      const onSelect = () => {
        setRequester(item);
        navigation.goBack();
      };
      return (
        <View>
          <AppBlockButton
            key={index}
            onPress={onSelect}
            style={[isFocus ? styles.itemFocus : { padding: vs(10) }]}>
            <AppText weight="500">{item.displayName}</AppText>
            {isFocus && <IconSelectHotel />}
          </AppBlockButton>
        </View>
      );
    },
    [navigation, requester?.id, setRequester],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <ViewContainer>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={goBack}>
        <Animated.View
          entering={FadeInDown.delay(0).duration(0)}
          style={[
            styles.container,
            { paddingBottom: bottom || vs(10), height: SCREEN_HEIGHT * 0.7 },
          ]}>
          <AppBlock
            pl={PaddingHorizontal}
            row
            justifyContent="space-between"
            alignItems="center"
            style={styles.buttonWith1}>
            <AppText size={20} weight="bold">
              {t('filter.selectRequester')}
            </AppText>
            <TouchableOpacity onPress={goBack} style={{ padding: PaddingHorizontal }}>
              <IconClose />
            </TouchableOpacity>
          </AppBlock>

          <View style={{ paddingHorizontal: PaddingHorizontal }}>
            <AppText mt={10} mb={6} weight="700">
              {t('filter.requester')}
            </AppText>
            <AppInputSearch
              fill={searchKey ? Colors.PRIMARY : '#BABABA'}
              showIconRemove
              containerStyle={styles.containerInputSearch}
              value={searchKey}
              onChangeText={onSearch}
              placeholder={t('filter.search')}
            />
          </View>

          <FlashList
            data={(flatData as IPickRequester[]) || []}
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
        </Animated.View>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default PickRequesterScreen;

const styles = StyleSheet.create({
  buttonWith1: { borderBottomWidth: 1, borderBottomColor: light.border },
  containerInputSearch: {
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: Colors.BLACK_100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(100),
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
