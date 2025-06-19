import { useMemo, useCallback} from 'react';
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  DataInformationItems,
  fetchInformationItemsData,
} from '../modal/InformationItemsModal';

const ITEMS_PER_PAGE = 50;
const key = ['informationItems'];

export function useInformationItemsViewModel() {
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
  } = useInfiniteQuery<DataInformationItems[], Error>({
    queryKey: key,
    queryFn: async ({pageParam}: {pageParam?: unknown}) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchInformationItemsData(page, ITEMS_PER_PAGE);
    },
    getNextPageParam: (lastPage, allPages) => lastPage.length === ITEMS_PER_PAGE
        ? allPages.length + 1
        : undefined,
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

  const onUpdatePrice = (id: number | string, price: number) => {
    const cached =
      queryClient.getQueryData<InfiniteData<DataInformationItems[]>>(key);

    if (!cached) {
      console.warn('🟥 No cache found for key:', key);
      return;
    }

    console.log('✅ Updating price...');
    queryClient.setQueryData(key, {
      ...cached,
      pages: cached.pages.map(page =>
        page.map(item => (item.id === id ? {...item, price} : item)),
      ),
    });
  };

  return {
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh,
    onLoadMore,
    onUpdatePrice,
  };
}
