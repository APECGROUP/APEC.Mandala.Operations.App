// views/viewmodal/useCreatePriceViewModal.ts

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { IApprove, IApproveFilters, fetchApprove } from '../modal/ApproveModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Images from '@assets/image/Images';
import { s } from 'react-native-size-matters';
import { goBack } from '@/navigation/RootNavigation';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500; // Tăng thời gian debounce để hiệu quả hơn với nhiều filter

// Giả định bạn đã cập nhật CreatePriceFilters trong CreatePriceModal.ts như sau:
// export interface CreatePriceFilters {
//   prNo?: string; // Đổi từ searchKey sang prNo
//   fromDate?: Date;
//   toDate?: Date;
//   department?: { id: string; name: string };
//   requester?: { id: string; name: string };
// }

export function useApproveViewModel(initialFilters: IApproveFilters = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { showToast } = useAlert();
  const [effectiveFilters, setEffectiveFilters] = useState<IApproveFilters>(initialFilters);
  const [currentUiFilters, setCurrentUiFilters] = useState<IApproveFilters>(initialFilters);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [textReason, setTextReason] = useState('');
  const isDisableButtonReject = useMemo(() => textReason.trim() === '', [textReason]);
  const debouncedSetEffectiveFiltersRef = useRef<ReturnType<
    typeof debounce<typeof setEffectiveFilters>
  > | null>(null);

  useEffect(() => {
    if (!debouncedSetEffectiveFiltersRef.current) {
      debouncedSetEffectiveFiltersRef.current = debounce(setEffectiveFilters, DEBOUNCE_DELAY);
    }
    return () => {
      debouncedSetEffectiveFiltersRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    debouncedSetEffectiveFiltersRef.current?.(currentUiFilters);
  }, [currentUiFilters]);

  // queryKey giờ sẽ dùng effectiveFilters.prNo
  const queryKey = useMemo(
    () => [
      'listApprove',
      effectiveFilters.prNo?.trim() || '', // Thay searchKey bằng prNo
      effectiveFilters.fromDate?.toISOString() || '',
      effectiveFilters.toDate?.toISOString() || '',
      effectiveFilters.department?.id || '',
      effectiveFilters.requester?.id || '',
      effectiveFilters.location?.id || '',
    ],
    [effectiveFilters],
  );

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
    error,
  } = useInfiniteQuery<IApprove[], Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchApprove(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  const onRefresh = useCallback(() => {
    console.log('onRefresh called from ViewModel. Forcing refetch.');
    refetch();
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    console.log('onLoadMore called.');
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // onSearch bây giờ cập nhật prNo
  const onSearch = useCallback((val: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: val })); // Thay searchKey bằng prNo
  }, []);

  const applyFilters = useCallback((newFilter: IApproveFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilter);
    setEffectiveFilters(newFilter);
  }, []);

  const { showAlert } = useAlert();
  const onDelete = useCallback(
    async (id: string, onSuccess?: (deletedId: string) => void) => {
      const currentQueryKey = [
        'listApprove',
        effectiveFilters.prNo?.trim() || '', // Thay searchKey bằng prNo
        effectiveFilters.fromDate?.toISOString() || '',
        effectiveFilters.toDate?.toISOString() || '',
        effectiveFilters.department?.id || '',
        effectiveFilters.requester?.id || '',
        effectiveFilters.location?.id || '',
      ];

      const cached = queryClient.getQueryData<InfiniteData<IApprove[]>>(currentQueryKey);
      if (!cached) {
        console.warn('🟥 No cache found for key:', currentQueryKey);
        return false;
      }

      try {
        if (Number(id) % 5 !== 0) {
          console.log('✅ Deleting item successfully...');
          queryClient.setQueryData(currentQueryKey, {
            ...cached,
            pages: cached.pages.map(page => page.filter(item => item.id !== id) || []),
          });

          onSuccess?.(id);
          return true;
        } else {
          await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
          showAlert(t('createPrice.warningRemove'), '', [
            {
              text: t('createPrice.close'),
              onPress: () => {},
            },
          ]);
          return false;
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        return false;
      }
    },
    [queryClient, effectiveFilters, showAlert, t],
  );

  const handleDelete = useCallback(
    (id: string, onSuccess?: (deletedId: string) => void) => {
      showAlert(t('createPrice.remove.title'), '', [
        {
          text: t('createPrice.remove.cancel'),
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: t('createPrice.remove.agree'),
          onPress: async () => {
            const success = await onDelete(id, onSuccess);
            if (!success) {
              console.log('❌ Delete failed, no action needed');
            }
          },
        },
      ]);
    },
    [showAlert, t, onDelete],
  );

  const onApproved = useCallback(
    async (ids: string[]) => {
      // Xoá các item có id nằm trong danh sách ids khỏi cache
      const currentQueryKey = [
        'listApprove',
        effectiveFilters.prNo?.trim() || '',
        effectiveFilters.fromDate?.toISOString() || '',
        effectiveFilters.toDate?.toISOString() || '',
        effectiveFilters.department?.id || '',
        effectiveFilters.requester?.id || '',
        effectiveFilters.location?.id || '',
      ];
      const cached = queryClient.getQueryData(currentQueryKey);
      console.log('cached:', cached);
      if (cached && cached.pages) {
        console.log('bấm on approved');
        // Loại bỏ các item có id nằm trong ids khỏi từng page
        const newPages = cached.pages.map((page: IApprove[]) =>
          page.filter(item => !ids.includes(item.id)),
        );
        queryClient.setQueryData(currentQueryKey, {
          ...cached,
          pages: newPages,
        });
        setSelectedIds([]);
      }
      showToast(t('createPrice.approvedSuccess'), 'success');
    },
    [queryClient, effectiveFilters, t, showToast],
  );

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
    async (ids: string[], func?: () => void) => {
      setIsLoadingConfirm(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentQueryKey = [
        'listApprove',
        effectiveFilters.prNo?.trim() || '',
        effectiveFilters.fromDate?.toISOString() || '',
        effectiveFilters.toDate?.toISOString() || '',
        effectiveFilters.department?.id || '',
        effectiveFilters.requester?.id || '',
        effectiveFilters.location?.id || '',
      ];
      const cached = queryClient.getQueryData(currentQueryKey);
      console.log('bấm reject');
      if (cached && cached.pages) {
        // Loại bỏ các item có id nằm trong ids khỏi từng page
        console.log('có cache reject:', cached);
        const newPages = cached.pages.map((page: IApprove[]) =>
          page.filter(item => !ids.includes(item.id)),
        );
        queryClient.setQueryData(currentQueryKey, {
          ...cached,
          pages: newPages,
        });
        setSelectedIds([]);

        setIsLoadingConfirm(false);
        if (func) {
          func();
        }
        onRejectSuccess();
      }
      showToast(t('createPrice.rejectSuccess'), 'success');
      console.log('text: ', textReason);
      // Xoá các item có id nằm trong danh sách ids khỏi cache
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      effectiveFilters.prNo,
      effectiveFilters.fromDate,
      effectiveFilters.toDate,
      effectiveFilters.department?.id,
      effectiveFilters.requester?.id,
      effectiveFilters.location?.id,
      queryClient,
      showToast,
      t,
      textReason,
    ],
  );

  return {
    onReject,
    selectedIds,
    setSelectedIds,
    onApproved,
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh,
    onLoadMore,
    onSearch,
    applyFilters,
    handleDelete,
    currentPrNoInput: currentUiFilters.prNo || '', // Thay searchKey bằng prNo
    currentFilters: currentUiFilters,
    isError,
    error,
    isLoadingConfirm,
    textReason,
    setTextReason,
    isDisableButtonReject,
  };
}
