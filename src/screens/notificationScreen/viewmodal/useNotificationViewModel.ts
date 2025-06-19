import {useMemo, useCallback} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {
  ContentNotification,
  fetchNotificationData,
} from '../modal/notificationModel';

const ITEMS_PER_PAGE = 10;

export function useNotificationViewModel() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  } = useInfiniteQuery<{data: ContentNotification[]; lastPage: boolean}, Error>(
    {
      queryKey: ['listNotifications'],
      queryFn: async ({pageParam = 1}) => {
        const page = typeof pageParam === 'number' ? pageParam : 1;
        return fetchNotificationData(page, ITEMS_PER_PAGE);
      },
      getNextPageParam: (lastPage, allPages) => 
        // Nếu chưa phải trang cuối thì còn trang tiếp theo
         lastPage.lastPage ? undefined : allPages.length + 1
      ,
      staleTime: 60 * 1000,
      initialPageParam: 1,
    },
  );

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data],
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  return {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh,
    onLoadMore,
  };
}
