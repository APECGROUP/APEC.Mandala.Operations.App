import { useMemo, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DetailOrderApprove, fetchDetailOrderApproveData } from '../modal/DetailOrderApproveModal';

const ITEMS_PER_PAGE = 50;

export function useDetailOrderApproveViewModel(orderId: string) {
  const key = ['detailOrderApprove', orderId];

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
  } = useInfiniteQuery<DetailOrderApprove[], Error>({
    queryKey: key,
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchDetailOrderApproveData(orderId, page, ITEMS_PER_PAGE);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    gcTime: 300000,
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);
  // console.log('render useInformationItemsViewModel');

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

  return {
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh,
    onLoadMore,
  };
}
