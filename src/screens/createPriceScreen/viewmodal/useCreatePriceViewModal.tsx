import { useState, useMemo, useCallback, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  IItemVendorPrice,
  fetchCreatePrice,
  CreatePriceFilters,
  checkRejectCreatePrice,
  checkApproveCreatePrice,
  checkDeleteCreatePrice,
  Pagination,
} from '../modal/CreatePriceModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { goBack } from '@/navigation/RootNavigation';
import { DeviceEventEmitter } from 'react-native';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500;

interface PageData {
  data: IItemVendorPrice[];
  pagination: Pagination;
}

export function useCreatePriceViewModel() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showToast, showAlert } = useAlert();

  const [uiFilters, setUiFilters] = useState<CreatePriceFilters>({
    status: { id: '3', name: t('filter.statusFilter.waiting'), code: 'W' },
  });
  const [effectiveFilters, setEffectiveFilters] = useState<CreatePriceFilters>({
    status: { id: '3', name: t('filter.statusFilter.waiting'), code: 'W' },
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const debouncedSetEffectiveFilters = useMemo(
    () => debounce(setEffectiveFilters, DEBOUNCE_DELAY),
    [],
  );

  useEffect(() => {
    debouncedSetEffectiveFilters(uiFilters);
    return () => debouncedSetEffectiveFilters.cancel();
  }, [uiFilters, debouncedSetEffectiveFilters]);

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
  } = useInfiniteQuery<PageData>({
    queryKey: ['listCreatePrice', effectiveFilters],
    queryFn: ({ pageParam = 1 }) =>
      fetchCreatePrice(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
    getNextPageParam: lastPage => {
      const nextPage = lastPage.pagination?.pageCurrent + 1;
      return nextPage <= lastPage.pagination?.pageCount ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Dùng useEffect để cập nhật totalItems từ data khi có thay đổi
  useEffect(() => {
    if (data?.pages[0]?.pagination?.rowCount !== undefined) {
      setTotalItems(data.pages[0].pagination.rowCount);
    } else {
      setTotalItems(0);
    }
  }, [data]);

  const flatData = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

  // Sửa lại hàm updateCache để cập nhật cả data trong cache của React Query
  const updateCache = useCallback(
    (action: (item: IItemVendorPrice) => boolean, totalItem: number = 1) => {
      queryClient.setQueryData(
        ['listCreatePrice', effectiveFilters],
        (cachedData: InfiniteData<PageData> | undefined) => {
          if (!cachedData) return undefined;

          const newPages = cachedData.pages.map(page => ({
            ...page,
            data: page.data.filter(action),
            // Giảm rowCount trực tiếp trong cache
            pagination: {
              ...page.pagination,
              rowCount:
                page.pagination.rowCount > totalItem ? page.pagination.rowCount - totalItem : 0,
            },
          }));

          // Đồng bộ state totalItems với giá trị mới từ cache
          setTotalItems(prev => (prev > totalItem ? prev - totalItem : 0));

          return { ...cachedData, pages: newPages };
        },
      );
    },
    [queryClient, effectiveFilters],
  );

  const onUpdateItem = useCallback(
    (updatedItem: IItemVendorPrice) => {
      queryClient.setQueryData(
        ['listCreatePrice', effectiveFilters],
        (cachedData: InfiniteData<PageData> | undefined) => {
          if (!cachedData) {
            return undefined;
          }

          const newPages = cachedData.pages.map(page => ({
            ...page,
            data: page.data.map(currentItem =>
              currentItem.id === updatedItem.id ? updatedItem : currentItem,
            ),
          }));

          // Sau khi update, cần trigger lại việc cập nhật totalItems để đồng bộ
          if (newPages[0]?.pagination?.rowCount !== undefined) {
            setTotalItems(newPages[0].pagination.rowCount);
          }

          return { ...cachedData, pages: newPages };
        },
      );
    },
    [queryClient, effectiveFilters],
  );

  const onRefresh = useCallback(() => refetch(), [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onSearch = useCallback((prNo: string) => {
    setUiFilters(prev => ({ ...prev, prNo }));
  }, []);

  const applyFilters = useCallback((newFilter: CreatePriceFilters) => {
    setUiFilters(newFilter);
    goBack();
  }, []);

  const onDelete = useCallback(
    async (id: number, onSuccess?: (deletedId: number) => void, onCloseSwipe?: () => void) => {
      try {
        const { isSuccess, message } = await checkDeleteCreatePrice(id);
        if (!isSuccess) {
          showToast(message || t('error.subtitle'), 'error');
          return;
        }
        onCloseSwipe?.();
        onSuccess?.(id);
        updateCache(item => item.id !== id, 1);
        setSelectedIds(prev => prev.filter(v => v !== id));
        showToast(t('createPrice.deleteSuccess'), TYPE_TOAST.SUCCESS);
      } catch (err) {
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
    // setSelectedIds([]);
    // setTimeout(() => {
    //   showToast(t('createPrice.approvedSuccess'), TYPE_TOAST.SUCCESS, true);
    // }, 300);
    // return;
    const { isSuccess, message } = await checkApproveCreatePrice(selectedIds);
    if (!isSuccess) {
      return showToast(message || t('error.subtitle'), 'error');
    }
    updateCache(item => !selectedIds.includes(item.id), selectedIds.length);
    setSelectedIds([]);
    setTimeout(() => {
      showToast(t('createPrice.approvedSuccess'), TYPE_TOAST.SUCCESS, true);
    }, 300);
  }, [selectedIds, showToast, t, updateCache]);

  const onReject = useCallback(async () => {
    const { isSuccess, message } = await checkRejectCreatePrice(selectedIds);
    if (!isSuccess) {
      return showToast(message || t('error.subtitle'), 'error');
    }
    updateCache(item => !selectedIds.includes(item.id), selectedIds.length);
    setSelectedIds([]);
    showToast(t('createPrice.rejectSuccess'), TYPE_TOAST.SUCCESS);
  }, [selectedIds, showToast, t, updateCache]);

  const toggleSelectAll = useCallback(() => {
    const allIds = flatData.map(item => item?.id);
    setSelectedIds(selectedIds.length === flatData.length ? [] : allIds);
  }, [selectedIds.length, flatData]);

  const handleSelect = useCallback((id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  }, []);

  const isAllSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length === flatData.length,
    [selectedIds.length, flatData.length],
  );

  useEffect(() => {
    DeviceEventEmitter.addListener('refreshListCreatePo', () => {
      console.log('refreshListCreatePo');
      onRefresh();
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('refreshListCreatePo');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedIds,
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    currentPrNoInput: uiFilters?.prNo || '',
    currentFilters: effectiveFilters,
    isError,
    error,
    selectedAll: isAllSelected,
    length: totalItems,
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
    onUpdateItem,
  };
}
