import { useState, useMemo, useCallback, useRef } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import {
  clearNotificationCache,
  ContentNotification,
  fetchNotificationData,
} from '../modal/notificationModel';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 300;

export function useNotificationViewModel() {
  const [searchKey, setSearchKey] = useState<string>('');
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);
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
    clearNotificationCache();
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

  const onDetail = async (id: number) => {
    const currentQueryKey = ['listNotification', searchKey.trim()];

    const cached = queryClient.getQueryData<InfiniteData<ContentNotification[]>>(currentQueryKey);
    if (!cached) {
      console.warn('🟥 No cache found for key:', currentQueryKey);
      return false;
    }
    try {
      const updatedData = {
        ...cached,
        pages: cached.pages.map(page =>
          page.map(item => {
            if (item.id === id) {
              return { ...item, read: true };
            }
            return item;
          }),
        ),
      };

      queryClient.setQueryData(currentQueryKey, updatedData);
      console.log('updateSuccess');
    } catch (err) {
      console.error('Error read item:', err);
    }
  };
  const readAll = async () => {
    const currentQueryKey = ['listNotification', searchKey.trim()];

    const cached = queryClient.getQueryData<InfiniteData<ContentNotification[]>>(currentQueryKey);
    if (!cached) {
      console.warn('🟥 No cache found for key:', currentQueryKey);
      return false;
    }
    try {
      const updatedData = {
        ...cached,
        pages: cached.pages.map(page => page.map(item => ({ ...item, read: true }))),
      };

      queryClient.setQueryData(currentQueryKey, updatedData);
      console.log('updateSuccess');
    } catch (err) {
      console.error('Error read item:', err);
    }
  };

  return {
    readAll,
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
    onDetail,
  };
}
