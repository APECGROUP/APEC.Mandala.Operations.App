import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  IItemCreatePo,
  fetchListCreatePo,
  CreatePoFilters,
  fetchCreatePo,
  Pagination,
} from '../modal/CreatePoModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TYPE_TOAST } from '@/elements/toast/Message';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500;

interface PageData {
  data: IItemCreatePo[];
  pagination: Pagination;
}

export function useCreatePoViewModel() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showToast, showAlert } = useAlert();
  const navigation = useNavigation();

  const [effectiveFilters, setEffectiveFilters] = useState<CreatePoFilters>();
  const [currentUiFilters, setCurrentUiFilters] = useState<CreatePoFilters>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoadingCreatePo, setIsLoadingCreatePo] = useState(false);
  const [totalItems, setTotalItems] = useState<number>(0);

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
      'listCreatePo',
      effectiveFilters?.prNo?.trim() || '',
      effectiveFilters?.prDate?.toISOString() || '',
      effectiveFilters?.expectedDate?.toISOString() || '',
      effectiveFilters?.department?.id || '',
      effectiveFilters?.requester?.id || '',
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
  } = useInfiniteQuery<PageData, Error>({
    queryKey: currentQueryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchListCreatePo(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
    getNextPageParam: lastPage => {
      const nextPage = lastPage.pagination?.pageCurrent + 1;
      return nextPage <= lastPage.pagination?.pageCount ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data?.pages[0]?.pagination?.rowCount !== undefined) {
      setTotalItems(data.pages[0].pagination.rowCount);
    } else {
      setTotalItems(0);
    }
  }, [data]);

  const flatData = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

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

  const applyFilters = useCallback((newFilter: CreatePoFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilter);
    setEffectiveFilters(newFilter);
  }, []);

  const updateCacheAndTotal = useCallback(
    (action: (item: IItemCreatePo) => boolean, totalItem: number = 1) => {
      queryClient.setQueryData(
        currentQueryKey,
        (cachedData: InfiniteData<PageData> | undefined) => {
          if (!cachedData) {
            return undefined;
          }

          const newPages = cachedData.pages.map(page => ({
            ...page,
            data: page.data.filter(action),
            pagination: {
              ...page.pagination,
              rowCount:
                page.pagination.rowCount > totalItem ? page.pagination.rowCount - totalItem : 0,
            },
          }));

          setTotalItems(prev => (prev > totalItem ? prev - totalItem : 0));

          return { ...cachedData, pages: newPages };
        },
      );
    },
    [queryClient, currentQueryKey],
  );

  const onDelete = useCallback(
    async (id: number, onSuccess?: (deletedId: number) => void) => {
      try {
        if (id % 5 !== 0) {
          updateCacheAndTotal(item => item.id !== id, 1);
          setSelectedIds(prev => prev.filter(v => v !== id));
          onSuccess?.(id);
          return true;
        } else {
          await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
          showAlert(t('CreatePo.warningRemove'), '', [
            { text: t('CreatePo.close'), onPress: () => {} },
          ]);
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    [showAlert, t, updateCacheAndTotal],
  );

  const handleDelete = useCallback(
    (id: number, onSuccess?: (deletedId: number) => void, onCancel?: () => void) => {
      showAlert(t('CreatePo.remove.title'), '', [
        { text: t('CreatePo.remove.cancel'), style: 'cancel', onPress: () => onCancel?.() },
        {
          text: t('CreatePo.remove.agree'),
          onPress: async () => {
            await onDelete(id, onSuccess);
          },
        },
      ]);
    },
    [showAlert, t, onDelete],
  );

  const onApproved = useCallback(async () => {
    updateCacheAndTotal(item => !selectedIds.includes(item.id), selectedIds.length);
    setSelectedIds([]);
    showToast(t('CreatePo.approvedSuccess'), 'success');
  }, [showToast, t, selectedIds, updateCacheAndTotal]);

  const onReject = useCallback(async () => {
    updateCacheAndTotal(item => !selectedIds.includes(item.id), selectedIds.length);
    setSelectedIds([]);
    showToast(t('CreatePo.rejectSuccess'), 'success');
  }, [showToast, t, selectedIds, updateCacheAndTotal]);

  const toggleSelectAll = useCallback(() => {
    const allIds = flatData.map(item => item?.id);
    setSelectedIds(selectedIds.length === flatData.length ? [] : allIds);
  }, [selectedIds.length, flatData]);

  const handleSelect = useCallback(
    (id: number) => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      setSelectedIds(prev => (prev.includes(id) ? [] : [id]));
    },
    [navigation],
  );

  const selectedAll = useMemo(
    () => selectedIds.length > 0 && selectedIds.length === flatData.length,
    [selectedIds.length, flatData.length],
  );

  const onCreatePo = useCallback(async () => {
    try {
      setIsLoadingCreatePo(true);
      const prNo = flatData.find(item => item.id === selectedIds[0])?.prNo || '';
      const { isSuccess, message } = await fetchCreatePo(prNo);

      if (!isSuccess) {
        showToast(message || t('error.subtitle'), TYPE_TOAST.ERROR);
        return;
      }

      updateCacheAndTotal(item => item.id !== selectedIds[0], 1);
      setSelectedIds([]);
      showToast(t('CreatePo.success'), TYPE_TOAST.SUCCESS);
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    } finally {
      setIsLoadingCreatePo(false);
    }
  }, [flatData, selectedIds, showToast, t, updateCacheAndTotal]);

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
    onCreatePo,
    isLoadingCreatePo,
  };
}
