import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient, InfiniteData } from '@tanstack/react-query';
import {
  AssignPriceFilters,
  IItemAssignPrice,
  fetchAssignPriceData,
  Pagination,
} from '../modal/AssignPriceModal';
import debounce from 'lodash/debounce';
import { DeviceEventEmitter } from 'react-native';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500;

interface PageData {
  data: IItemAssignPrice[];
  pagination: Pagination;
}

export function useAssignPriceViewModel(initialFilters: AssignPriceFilters = {}) {
  const queryClient = useQueryClient();
  const [effectiveFilters, setEffectiveFilters] = useState<AssignPriceFilters>(initialFilters);
  const [currentUiFilters, setCurrentUiFilters] = useState<AssignPriceFilters>(initialFilters);
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

  useEffect(() => {
    DeviceEventEmitter.addListener('refreshListAssignPrice', () => {
      console.log('refreshListAssignPrice');
      refetch();
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('refreshListAssignPrice');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryKey = useMemo(
    () => [
      'listAssignPrice',
      effectiveFilters.prNo?.trim() || '',
      effectiveFilters.prDate?.toISOString() || '',
      effectiveFilters.expectedDate?.toISOString() || '',
      effectiveFilters.department?.id || '',
      effectiveFilters.requester?.id || '',
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
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchAssignPriceData(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
    getNextPageParam: lastPage => {
      const nextPage = lastPage.pagination.pageCurrent + 1;
      return nextPage <= lastPage.pagination.pageCount ? nextPage : undefined;
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

  // const onRefresh = useCallback(() => {
  //   if (isFetching || isRefetching || isLoading) {
  //     return;
  //   }
  //   console.log('onRefresh list nè: ');
  //   refetch();
  // }, [isFetching, isLoading, isRefetching, refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const onSearchPrNo = useCallback((key: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: key }));
  }, []);

  const applyFilters = useCallback((newFilters: AssignPriceFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilters);
    setEffectiveFilters(newFilters);
  }, []);

  const updateCacheAndTotal = useCallback(
    (v: number) => {
      queryClient.setQueryData(queryKey, (cachedData: InfiniteData<PageData> | undefined) => {
        if (!cachedData) {
          return undefined;
        }

        const newPages = cachedData.pages.map(page => ({
          ...page,
          data: page.data.filter(i => i.id !== v),
          pagination: {
            ...page.pagination,
            rowCount: page.pagination.rowCount > 1 ? page.pagination.rowCount - 1 : 0,
          },
        }));

        setTotalItems(prev => (prev > 1 ? prev - 1 : 0));

        return { ...cachedData, pages: newPages };
      });
    },
    [queryClient, queryKey],
  );

  return {
    data: flatData,
    length: totalItems,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh: refetch,
    onLoadMore,
    onSearchPrNo,
    applyFilters,
    currentPrNoInput: currentUiFilters.prNo || '',
    currentFilters: currentUiFilters,
    isError,
    error,
    updateCacheAndTotal,
  };
}
