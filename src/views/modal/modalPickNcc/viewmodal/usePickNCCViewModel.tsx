import { useState, useMemo, useCallback } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { fetchNccData, IItemSupplier, ResponseNcc } from '../modal/PickNccModal';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 300;

export function usePickNCCViewModel() {
  const [searchKey, setSearchKey] = useState<string>('');
  const queryClient = useQueryClient();

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
  } = useInfiniteQuery<IItemSupplier[], Error>({
    queryKey: ['listNcc', searchKey.trim(), searchKey],
    queryFn: async ({ pageParam }: { pageParam?: any }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchNccData(page, ITEMS_PER_PAGE, searchKey);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);
  // console.log('render useAssignPriceViewModel');
  // Debounce search
  const debouncedSearch = useMemo(
    () =>
      debounce((key: string) => {
        setSearchKey(key);
        queryClient.removeQueries({ queryKey: ['assignPrice'] });
      }, DEBOUNCE_DELAY),
    [queryClient],
  );

  // Refresh (kéo xuống)
  const onRefresh = useCallback(() => {
    console.log('onRefresh');
    if (isFetching || isRefetching || isLoading) {
      return;
    }
    refetch();
  }, [isFetching, isLoading, isRefetching, refetch]);

  // Load more (cuộn cuối danh sách)
  const onLoadMore = useCallback(() => {
    console.log('loadMore');
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Search
  const onSearch = useCallback(
    (key: string) => {
      debouncedSearch(key);
    },
    [debouncedSearch],
  );

  return {
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh,
    onLoadMore,
    onSearch,
    searchKey,
  };
}
