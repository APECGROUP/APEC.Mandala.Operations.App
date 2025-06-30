import { useState, useMemo, useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { ContentNotification, fetchNotificationData } from '../modal/notificationModel';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 300;

export function useNotificationViewModel() {
  const [searchKey, setSearchKey] = useState<string>('');
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

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
  } = useInfiniteQuery<ContentNotification[], Error>({
    queryKey: ['listNotification', searchKey.trim()],
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchNotificationData(page, ITEMS_PER_PAGE);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  // Debounce search - chỉ tạo một lần
  const debouncedSearch = useMemo(() => {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debounce((key: string) => {
        setSearchKey(key);
      }, DEBOUNCE_DELAY);
    }
    return debouncedSearchRef.current;
  }, []);

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
    isError,
  };
}
