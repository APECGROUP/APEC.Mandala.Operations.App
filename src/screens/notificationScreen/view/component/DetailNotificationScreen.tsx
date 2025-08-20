import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import api from '@/utils/setup-axios';
import { ENDPOINT, PaddingHorizontal } from '@/utils/Constans';
import { IParams } from '@/screens/approvePrScreen/modal/ApproveModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '@/navigation/params';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { TYPE_TOAST } from '@/elements/toast/Message';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import {
  IItemInDetailPr,
  IResponsePRDetail,
} from '@/screens/InformationItemScreen/modal/InformationItemsModal';
import { FlashList } from '@shopify/flash-list';
import { vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import light from '@/theme/light';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import { getFontSize } from '@/constants';
import { Colors } from '@/theme/Config';
import DetailOrderItemCard from '@/screens/detailOrderApproveScreen/view/component/DetailOrderItemCard';

const DetailNotificationScreen = ({
  route,
}: NativeStackScreenProps<MainParams, 'DetailNotificationScreen'>) => {
  const { PrNo } = route.params;
  const { showToast } = useAlert();
  const { t } = useTranslation();
  const [data, setData] = useState<IItemInDetailPr[]>();
  const [isRefetching, setIsRefetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getDetail = async () => {
    try {
      const params: IParams = {
        pagination: {
          pageIndex: 1,
          pageSize: 50,
          isAll: true,
        },
        filter: {
          textSearch: PrNo,
          filterGroup: [
            {
              condition: 'And',
              filters: [],
            },
          ],
        },
      };
      const response = await api.post<IResponsePRDetail>(ENDPOINT.DETAIL_PR, params);
      if (response.status !== 200) {
        throw new Error();
      }
      if (response.data.isSuccess) {
        setData(response.data.data);
      }
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: IItemInDetailPr; index: number }) => (
      // <DetailOrderItemCard onUpdateQuantity={onUpdateQuantity} item={item} index={index} />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUpdatePrice],
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
        <AppText style={styles.emptyText}>{t('home.empty')}</AppText>
      </View>
    );
  };
  const onRefresh = async () => {
    setIsRefetching(true);
    await getDetail();
    setIsRefetching(false);
  };
  useEffect(() => {
    getDetail().then(() => setIsLoading(false));
  }, []);

  return (
    <ViewContainer>
      <View>
        <FlashList
          // data={[]}
          data={data || []}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}-${item.price}`}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          refreshing={isRefetching}
          onRefresh={onRefresh}
          scrollEventThrottle={16}
          ListEmptyComponent={listEmptyComponent}
          estimatedItemSize={100}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ViewContainer>
  );
};

export default DetailNotificationScreen;

const styles = StyleSheet.create({
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
});
