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
import { DeviceEventEmitter } from 'react-native';
import { IItemVendorPrice } from '@/screens/createPriceScreen/modal/CreatePriceModal';

const ITEMS_PER_PAGE = 50;

export function useInformationItemsViewModel(id: number, prNo: string) {
  const queryClient = useQueryClient();
  const key = ['informationItems', prNo];
  const { showAlert, showToast, showLoading, hideLoading } = useAlert();
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
    staleTime: 0,
    gcTime: 0,
    // staleTime: 60 * 1000,
    // gcTime: 300000,
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
    console.log('onUpdatePrice: ', idItem, price);
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page =>
        page.map(item => (item.id === idItem ? { ...item, price } : item)),
      ),
    });
  };
  const onUpdateNCC = (idItem: number, vendor: IItemVendorPrice) => {
    const cached = queryClient.getQueryData<InfiniteData<IItemInDetailPr[]>>(key);
    console.log('3333333,', idItem, vendor, cached);
    if (!cached) {
      console.warn('🟥 No cache found for key:', key);
      return;
    }

    // console.log('✅ Updating price...');
    console.log('onUpdateVendor: ', idItem, vendor);
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page =>
        page.map(item => (item.id === idItem ? { ...item, ...vendor } : item)),
      ),
    });
  };
  const onAutoAssign = async () => {
    try {
      showLoading();
      const res = await fetchAutoAssign(id);
      const { isSuccess, message, data: updatedItems } = res;
      console.log('data mới: ', updatedItems);
      if (!isSuccess || !Array.isArray(updatedItems)) {
        console.log('thất bại: ', message);
        return showToast(message || t('informationItem.autoAssignError'), 'error');
      }

      // Cập nhật lại dữ liệu trong cache bằng cách merge các item đã auto assign
      const cached = queryClient.getQueryData<InfiniteData<IItemInDetailPr[]>>(key);

      if (!cached) {
        console.warn('🟥 Không tìm thấy cache để cập nhật auto assign');
        return;
      }

      queryClient.setQueryData(key, {
        ...cached,
        pages: cached.pages.map(page =>
          page.map(item => {
            const updated = updatedItems.find(i => i.id === item.id);
            console.log('11111111', updated, updatedItems, page);
            return updated
              ? {
                  ...item,
                  ...updated,
                  vendor: updated.vendor || updated?.vendorCode,
                  vat: updated.vat || updated.vatCode,
                }
              : item;
          }),
        ),
      });

      showToast(t('informationItem.autoAssignSuccess'), TYPE_TOAST.SUCCESS);
    } catch (error) {
      console.log('❌ Auto assign error:', error);
      showToast(t('informationItem.autoAssignError'), TYPE_TOAST.ERROR);
    } finally {
      hideLoading();
    }
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

  const onUpdateQuantity = (itemNew: IItemInDetailPr) => {
    const cached = queryClient.getQueryData<InfiniteData<IItemInDetailPr[]>>(key);

    if (!cached) {
      console.warn('🟥 No cache found for key:', key);
      return;
    }

    // console.log('✅ Updating price...');
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page => page.map(item => (item.id === itemNew.id ? itemNew : item))),
    });
  };

  const onAssign = async (func?: (i?: any) => void) => {
    try {
      // func?.();
      // return;
      setIsLoadingAssign(true);
      const { isSuccess, message } = await checkAssignPr(id, flatData);
      console.log('gán giá api: ', isSuccess, message);
      DeviceEventEmitter.emit('refreshListAssignPrice');
      setIsLoadingAssign(false);
      if (!isSuccess) {
        return showToast(message || t('error.subtitle'), TYPE_TOAST.ERROR);
      }
      if (func) {
        console.log('có hàm nè');
        func(id);
      }
      console.log('gán giá thành công');
      showAlert(
        t('informationItem.assignSuccess'),
        '',
        [
          {
            text: t('Trở về'),
            onPress: () => {
              // DeviceEventEmitter.emit('refreshListAssignPrice');
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
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    }
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
    onUpdateNCC,
    onReject,
    setTextReason,
    onSaveDraft,
    onAssign,
    onUpdateQuantity,
  };
}
