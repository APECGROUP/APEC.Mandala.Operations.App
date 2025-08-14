import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { PcPrFilters, IItemPcPr, fetchPcPrData, Pagination } from '../modal/PcPrModal';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500;

interface PageData {
  data: IItemPcPr[];
  pagination: Pagination;
}

export function usePcPrViewModel() {
  const [effectiveFilters, setEffectiveFilters] = useState<PcPrFilters>();
  const [currentUiFilters, setCurrentUiFilters] = useState<PcPrFilters>();
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

  const queryKey = useMemo(
    () => [
      'listPcPr',
      effectiveFilters?.prNo?.trim() || '',
      effectiveFilters?.pO?.trim() || '',
      effectiveFilters?.prDate?.toISOString() || '',
      effectiveFilters?.expectedDate?.toISOString() || '',
      effectiveFilters?.department?.id || '',
      effectiveFilters?.store?.id || '',
      effectiveFilters?.status?.status || '',
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
    queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchPcPrData(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
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
    if (isFetching || isRefetching || isLoading) {
      return;
    }
    refetch();
  }, [isFetching, isLoading, isRefetching, refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const onSearchPrNo = useCallback((key: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: key }));
  }, []);

  const applyFilters = useCallback((newFilters: PcPrFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilters);
    setEffectiveFilters(newFilters);
  }, []);

  return {
    data: flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    length: totalItems,
    onRefresh,
    onLoadMore,
    onSearchPrNo,
    applyFilters,
    currentPrNoInput: currentUiFilters?.prNo || '',
    currentFilters: currentUiFilters,
    isError,
    error,
  };
}
