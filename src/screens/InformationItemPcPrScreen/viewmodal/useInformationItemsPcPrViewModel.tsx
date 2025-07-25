import { useMemo, useCallback, useState } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { s } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { goBack } from '@/navigation/RootNavigation';
import Images from '@assets/image/Images';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import {
  DataInformationItemsPcPr,
  fetchInformationItemsPcPrData,
} from '../modal/InformationItemsPcPrModal';

const ITEMS_PER_PAGE = 50;

export function useInformationItemsPcPrViewModel(id: string) {
  const queryClient = useQueryClient();
  const key = ['InformationItemsPcPr', id];
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  // Infinite Query cho phân trang + search
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isError,
  } = useInfiniteQuery<DataInformationItemsPcPr[], Error>({
    queryKey: key,
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchInformationItemsPcPrData(page, ITEMS_PER_PAGE, id);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    gcTime: 300000,
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);
  // console.log('render useInformationItemsPcPrViewModel');

  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [textReason, setTextReason] = useState('');
  // Refresh (kéo xuống)
  const onRefresh = useCallback(() => {
    console.log('onRefresh');
    if (isFetching || isRefetching || isLoading) {
      return;
    }
    refetch();
  }, [isFetching, isLoading, isRefetching, refetch]);
  const isDisableButtonReject = useMemo(() => textReason.trim(), [textReason]);
  // Load more (cuộn cuối danh sách)
  const onLoadMore = useCallback(() => {
    console.log('loadMore');
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const onUpdatePrice = (idItem: string, price: number) => {
    const cached = queryClient.getQueryData<InfiniteData<DataInformationItemsPcPr[]>>(key);

    if (!cached) {
      console.warn('🟥 No cache found for key:', key);
      return;
    }

    console.log('✅ Updating price...');
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page =>
        page.map(item => (item.id === idItem ? { ...item, price } : item)),
      ),
    });
  };
  const onAutoAssign = () => {
    const cached = queryClient.getQueryData<InfiniteData<DataInformationItemsPcPr[]>>(key);

    if (!cached) {
      console.warn('🟥 No cache found for key:', key);
      return;
    }

    // Gán giá random (bội 1000) và NCC random cho từng item
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page =>
        page.map(item => ({
          ...item,
          price: Math.floor(Math.random() * 10 + 1) * 1000, // random 1000-10000
          ncc: 'NCC_' + Math.floor(Math.random() * 100), // NCC random
        })),
      ),
    });
  };

  const onRejectSuccess = () => {
    showAlert(
      t('informationItem.rejectSuccess'),
      '',
      [
        {
          text: t('Trở về'),
          onPress: goBack,
        },
      ],
      <FastImage
        source={Images.ModalApprovedError}
        style={{ width: s(285), aspectRatio: 285 / 187 }}
      />,
    );
  };
  const onReject = useCallback(
    async (func?: () => void) => {
      try {
        setIsLoadingConfirm(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('text: ', textReason);
        setIsLoadingConfirm(false);

        if (func) {
          func();
        }
        onRejectSuccess();
      } catch (error) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textReason],
  );

  return {
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    isError,
    isLoadingConfirm,
    textReason,
    isDisableButtonReject,
    onAutoAssign,
    onRefresh,
    onLoadMore,
    onUpdatePrice,
    onReject,
    setTextReason,
  };
}
