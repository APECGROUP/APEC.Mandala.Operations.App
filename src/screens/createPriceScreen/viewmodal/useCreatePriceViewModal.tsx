// views/viewmodal/useCreatePriceViewModal.ts

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  IItemVendorPrice,
  fetchCreatePrice,
  CreatePriceFilters,
  checkRejectCreatePrice,
  checkApproveCreatePrice,
  checkDeleteCreatePrice,
} from '../modal/CreatePriceModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { TYPE_TOAST } from '@/elements/toast/Message';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500;

export function useCreatePriceViewModel() {
  const length = useRef<number>(0);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showToast, showAlert } = useAlert();

  const [effectiveFilters, setEffectiveFilters] = useState<CreatePriceFilters>();
  const [currentUiFilters, setCurrentUiFilters] = useState<CreatePriceFilters>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const currentQueryKey = useMemo(
    () => [
      'listCreatePrice',
      effectiveFilters?.prNo?.trim() || null,
      effectiveFilters?.product?.id || null,
      effectiveFilters?.ncc?.id || null,
      effectiveFilters?.status?.id || null,
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
  } = useInfiniteQuery<IItemVendorPrice[], Error>({
    queryKey: currentQueryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchCreatePrice(pageParam as number, ITEMS_PER_PAGE, effectiveFilters, length),
    getNextPageParam: lastPage =>
      lastPage.length === ITEMS_PER_PAGE ? lastPage.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onSearch = useCallback((val: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: val }));
  }, []);

  const applyFilters = useCallback((newFilter: CreatePriceFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilter);
    setEffectiveFilters(newFilter);
  }, []);

  // Hàm cập nhật cache dùng chung
  const updateCache = useCallback(
    (action: (item: IItemVendorPrice) => boolean) => {
      queryClient.setQueryData(
        currentQueryKey,
        (cachedData: InfiniteData<IItemVendorPrice[]> | undefined) => {
          if (!cachedData) return undefined;
          const newPages = cachedData.pages.map(page => page.filter(action));
          console.log('có data: ', cachedData, newPages);
          return { ...cachedData, pages: newPages };
        },
      );
    },
    [queryClient, currentQueryKey],
  );
  console.log('first render: ', flatData);
  // --- Hàm onDelete đã được refactor ---
  const onDelete = useCallback(
    async (id: number, onSuccess?: (deletedId: number) => void, onCloseSwipe?: () => void) => {
      try {
        const { isSuccess, message } = await checkDeleteCreatePrice(id);
        if (!isSuccess) {
          showToast(message || t('error.subtitle'), 'error');
          return;
        }
        onSuccess?.(id);
        onCloseSwipe?.();

        // Cập nhật cache trực tiếp
        updateCache(item => item.id !== id);
        setSelectedIds(prev => prev.filter(v => v !== id));
        showToast(t('createPrice.deleteSuccess'), TYPE_TOAST.SUCCESS);
      } catch (err) {
        console.error('Error deleting item:', err);
        showToast(t('error.subtitle'), 'error');
      }
    },
    [showToast, t, updateCache],
  );

  const handleDelete = useCallback(
    (id: number, onSuccess?: (deletedId: number) => void, onCancel?: () => void) => {
      showAlert(t('createPrice.remove.title'), '', [
        {
          text: t('createPrice.remove.cancel'),
          style: 'cancel',
          onPress: () => onCancel?.(),
        },
        {
          text: t('createPrice.remove.agree'),
          onPress: () => onDelete(id, onSuccess, onCancel),
        },
      ]);
    },
    [showAlert, t, onDelete],
  );

  const onApproved = useCallback(async () => {
    const { isSuccess, message } = await checkApproveCreatePrice(selectedIds);
    if (!isSuccess) {
      return showToast(message || t('error.subtitle'), 'error');
    }
    updateCache(item => !selectedIds.includes(item.id));
    setSelectedIds([]);
    showToast(t('createPrice.approvedSuccess'), TYPE_TOAST.SUCCESS);
  }, [selectedIds, showToast, t, updateCache]);

  const onReject = useCallback(async () => {
    const { isSuccess, message } = await checkRejectCreatePrice(selectedIds);
    if (!isSuccess) {
      return showToast(message || t('error.subtitle'), 'error');
    }
    updateCache(item => !selectedIds.includes(item.id));
    setSelectedIds([]);
    showToast(t('createPrice.rejectSuccess'), TYPE_TOAST.SUCCESS);
  }, [selectedIds, showToast, t, updateCache]);

  const toggleSelectAll = useCallback(() => {
    const allIds = flatData.map(item => item.id);
    setSelectedIds(selectedIds.length === flatData.length ? [] : allIds);
  }, [selectedIds.length, flatData]);

  const handleSelect = useCallback((id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  }, []);

  const selectedAll = useMemo(
    () => selectedIds.length === flatData.length && flatData.length > 0,
    [selectedIds.length, flatData.length],
  );

  return {
    selectedIds,
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    currentPrNoInput: currentUiFilters?.prNo || '',
    currentFilters: currentUiFilters,
    isError,
    error,
    selectedAll,
    length: length.current,
    onReject,
    setSelectedIds,
    onApproved,
    onRefresh,
    onLoadMore,
    onSearch,
    applyFilters,
    handleDelete,
    toggleSelectAll,
    handleSelect,
  };
}
