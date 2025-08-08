import { useMemo, useCallback, useState } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  IItemInDetailPr,
  fetchInformationItemsData,
  fetchSavedraft,
} from '../modal/InformationItemsModal';
import { s } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { goBack } from '@/navigation/RootNavigation';
import Images from '@assets/image/Images';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import {
  checkAssignPr,
  checkRejectPrAssign,
  fetchAutoAssign,
} from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { TYPE_TOAST } from '@/elements/toast/Message';

const ITEMS_PER_PAGE = 50;

export function useInformationItemsViewModel(id: number, prNo: string) {
  const queryClient = useQueryClient();
  const key = ['informationItems', prNo];
  const { showAlert, showToast } = useAlert();
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
  } = useInfiniteQuery<IItemInDetailPr[], Error>({
    queryKey: key,
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchInformationItemsData(page, ITEMS_PER_PAGE, prNo);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    gcTime: 300000,
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);
  // console.log('render useInformationItemsViewModel');

  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const [textReason, setTextReason] = useState('');
  // Refresh (kéo xuống)
  const onRefresh = useCallback(() => {
    // console.log('onRefresh');
    if (isFetching || isRefetching || isLoading) {
      return;
    }
    refetch();
  }, [isFetching, isLoading, isRefetching, refetch]);
  const isDisableButtonReject = useMemo(() => !textReason.trim(), [textReason]);
  // Load more (cuộn cuối danh sách)
  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const onUpdatePrice = (idItem: number, price: number) => {
    const cached = queryClient.getQueryData<InfiniteData<IItemInDetailPr[]>>(key);

    if (!cached) {
      console.warn('🟥 No cache found for key:', key);
      return;
    }

    // console.log('✅ Updating price...');
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page =>
        page.map(item => (item.id === idItem ? { ...item, price } : item)),
      ),
    });
  };
  const onAutoAssign = async () => {
    try {
      // const cached = queryClient.getQueryData<InfiniteData<IItemInDetailPr[]>>(key);

      // if (!cached) {
      //   console.warn('🟥 No cache found for key:', key);
      //   return;
      // }

      const cached = queryClient.getQueryData(key);
      const newPages = cached.pages.map((page: IItemVendorPrice[]) =>
        page.filter(item => !selectedIds.includes(item.id)),
      );
      const { isSuccess, message, data } = await fetchAutoAssign(id);
      if (!isSuccess) {
        console.log('thất bại: ', message);
        return showToast(message || t('informationItem.autoAssignError'), 'error');
      }
      queryClient.setQueryData(key, {
        ...cached,
        pages: newPages,
      });
      // refetch();
      // Gán giá random (bội 1000) và NCC random cho từng item
      // queryClient.setQueryData(key, {
      //   ...cached,
      //   pages: cached.pages.map(page =>
      //     page.map(item => ({
      //       ...item,
      //       price: Math.floor(Math.random() * 10 + 1) * 1000, // random 1000-10000
      //       ncc: 'NCC_' + Math.floor(Math.random() * 100), // NCC random
      //     })),
      //   ),
      // });
    } catch (error) {}
  };
  const onSaveDraft = async () => {
    try {
      const { isSuccess, message } = await fetchSavedraft(id, flatData);
      if (!isSuccess) {
        return showToast(message || t('error.subtitle'), 'error');
      }
      showToast(t('informationItem.saveDraftSuccess'), TYPE_TOAST.SUCCESS);

      refetch();
    } catch (error) {}
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
      setIsLoadingConfirm(true);
      console.log('bấm reject', textReason);
      // Loại bỏ các item có id nằm trong ids khỏi từng page
      const { isSuccess, message } = await checkRejectPrAssign(id, textReason || '');
      console.log('thất bại: ', !isSuccess, textReason);
      setIsLoadingConfirm(false);
      if (!isSuccess) {
        return showToast(message || t('createPrice.rejectFail'), 'error');
      }

      if (func) {
        func();
      }
      onRejectSuccess();
      showToast(t('createPrice.rejectSuccess'), 'success');
      // Xoá các item có id nằm trong danh sách ids khỏi cache
    },
    [id, showToast, t, textReason],
  );

  const onAssign = async (func?: () => void) => {
    try {
      setIsLoadingAssign(true);
      const { isSuccess, message } = await checkAssignPr(id, flatData);
      setIsLoadingAssign(false);
      if (!isSuccess) {
        return showToast(message || t('error.subtitle'), TYPE_TOAST.ERROR);
      }
      if (func) {
        func();
      }
      showAlert(
        t('informationItem.assignSuccess'),
        '',
        [
          {
            text: t('Trở về'),
            onPress: () => {
              goBack();
            },
          },
        ],
        <FastImage
          source={Images.ModalApprovedSuccess}
          style={{ width: s(285), aspectRatio: 285 / 187 }}
        />,
        // <ConfettiAnimation
        //   autoPlay={true}
        //   loop={false}
        //   style={{
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //   }}
        // />,
      );
    } catch (error) {}
  };

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
    isLoadingAssign,
    onAutoAssign,
    onRefresh,
    onLoadMore,
    onUpdatePrice,
    onReject,
    setTextReason,
    onSaveDraft,
    onAssign,
  };
}
