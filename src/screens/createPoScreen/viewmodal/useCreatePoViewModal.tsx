// views/viewmodal/useCreatePoViewModal.ts

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  IItemCreatePo,
  fetchListCreatePo,
  CreatePoFilters,
  fetchCreatePo,
} from '../modal/CreatePoModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TYPE_TOAST } from '@/elements/toast/Message';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500; // Tăng thời gian debounce để hiệu quả hơn với nhiều filter

export function useCreatePoViewModel(initialFilters: CreatePoFilters = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { showToast } = useAlert();
  const [effectiveFilters, setEffectiveFilters] = useState<CreatePoFilters>(initialFilters);
  const [currentUiFilters, setCurrentUiFilters] = useState<CreatePoFilters>(initialFilters);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoadingCreatePo, setIsLoadingCreatePo] = useState(false);
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
  const currentQueryKey = useMemo(
    () => [
      'listCreatePo',
      effectiveFilters.prNo?.trim() || '', // Thay searchKey bằng prNo
      effectiveFilters.prDate?.toISOString() || '',
      effectiveFilters.expectedDate?.toISOString() || '',
      effectiveFilters.department?.id || '',
      effectiveFilters.requester?.id || '',
      effectiveFilters.product?.id || '',
      effectiveFilters.ncc?.id || '',
      effectiveFilters.status?.id || '',
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
  } = useInfiniteQuery<IItemCreatePo[], Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: currentQueryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchListCreatePo(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
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

  const applyFilters = useCallback((newFilter: CreatePoFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilter);
    setEffectiveFilters(newFilter);
  }, []);

  const { showAlert } = useAlert();
  const onDelete = useCallback(
    async (id: number, onSuccess?: (deletedId: number) => void) => {
      const cached = queryClient.getQueryData<InfiniteData<IItemCreatePo[]>>(currentQueryKey);
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
          setSelectedIds(prev => prev.filter(v => v !== id));

          onSuccess?.(id);
          return true;
        } else {
          await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
          showAlert(t('CreatePo.warningRemove'), '', [
            {
              text: t('CreatePo.close'),
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
    [queryClient, currentQueryKey, showAlert, t],
  );

  const handleDelete = useCallback(
    (id: string, onSuccess?: (deletedId: string) => void, onCancel?: () => void) => {
      console.log('handleDelete called with onCancel:', !!onCancel);
      showAlert(t('CreatePo.remove.title'), '', [
        {
          text: t('CreatePo.remove.cancel'),
          style: 'cancel',
          onPress: () => {
            console.log('Cancel button pressed, onCancel exists:', !!onCancel);
            console.log('onCancel type:', typeof onCancel);
            onCancel?.();
          },
        },
        {
          text: t('CreatePo.remove.agree'),
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

  const onApproved = useCallback(async () => {
    // Xoá các item có id nằm trong danh sách ids khỏi cache
    const cached = queryClient.getQueryData(currentQueryKey);
    if (cached && cached.pages) {
      // Loại bỏ các item có id nằm trong ids khỏi từng page
      const newPages = cached.pages.map((page: IItemCreatePo[]) =>
        page.filter(item => !selectedIds.includes(item.id)),
      );
      queryClient.setQueryData(currentQueryKey, {
        ...cached,
        pages: newPages,
      });
      setSelectedIds([]);
    }
    showToast(t('CreatePo.approvedSuccess'), 'success');
  }, [queryClient, currentQueryKey, showToast, t, selectedIds]);
  const onReject = useCallback(async () => {
    // Xoá các item có id nằm trong danh sách ids khỏi cache
    const cached = queryClient.getQueryData(currentQueryKey);
    if (cached && cached.pages) {
      // Loại bỏ các item có id nằm trong ids khỏi từng page
      const newPages = cached.pages.map((page: IItemCreatePo[]) =>
        page.filter(item => !selectedIds.includes(item.id)),
      );
      queryClient.setQueryData(currentQueryKey, {
        ...cached,
        pages: newPages,
      });
      setSelectedIds([]);
    }
    showToast(t('CreatePo.rejectSuccess'), 'success');
  }, [queryClient, currentQueryKey, showToast, t, selectedIds]);
  const toggleSelectAll = useCallback(() => {
    const allIds = flatData.map(item => item?.id);
    if (selectedIds.length === flatData.length) {
      setSelectedIds([]); // Bỏ chọn tất cả
    } else {
      setSelectedIds(allIds); // Chọn tất cả
    }
  }, [selectedIds.length, flatData, setSelectedIds]);
  const navigation = useNavigation();
  const handleSelect = useCallback(
    (id: number) => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' }, // hoặc undefined
      });
      // setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
      setSelectedIds(prev => (prev.includes(id) ? [] : [id]));
    },
    [navigation],
  );

  const selectedAll = useMemo(
    () => selectedIds.length === flatData.length && flatData.length > 0,
    [selectedIds.length, flatData.length],
  );
  const onCreatePo = useCallback(async () => {
    const cached = queryClient.getQueryData<InfiniteData<IItemCreatePo[]>>(currentQueryKey);
    if (!cached) {
      console.warn('🟥 No cache found for key:', currentQueryKey);
      return false;
    }
    const prNo = cached.pages.find(page => page.length > 0)?.[0]?.prNo || '';
    console.log('Creating PO with prNo:', prNo);
    try {
      setIsLoadingCreatePo(true);
      const { isSuccess, message } = await fetchCreatePo(prNo);
      setIsLoadingCreatePo(false);
      if (!isSuccess) {
        return showToast(message || t('error.subtitle'), TYPE_TOAST.ERROR);
      }
      queryClient.setQueryData(currentQueryKey, {
        ...cached,
        pages: cached.pages.map(page => page.filter(item => item.id !== selectedIds[0]) || []),
      });
      setSelectedIds([]);
      showToast(t('CreatePo.success'), TYPE_TOAST.SUCCESS);
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    } finally {
      setIsLoadingCreatePo(false);
    }
  }, [currentQueryKey, queryClient, selectedIds, showToast, t]);
  return {
    selectedIds,
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    currentPrNoInput: currentUiFilters.prNo || '', // Thay searchKey bằng prNo
    currentFilters: currentUiFilters,
    isError,
    error,
    selectedAll,
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
    onCreatePo,
  };
}
