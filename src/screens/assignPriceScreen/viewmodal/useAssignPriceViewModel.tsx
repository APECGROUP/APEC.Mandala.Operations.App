import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAssignPriceData } from '../modal/AssignPriceModal';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 300;

export function useAssignPriceViewModel(filters) {
  const queryKey = useMemo(
    () => [
      'listAssignPrice',
      filters?.prNo || '',
      filters?.fromDate ? filters.fromDate.toISOString() : '',
      filters?.toDate ? filters.toDate.toISOString() : '',
      filters?.department?.id || '',
      filters?.requester?.id || '',
    ],
    [filters?.prNo, filters?.fromDate, filters?.toDate, filters?.department, filters?.requester],
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
  } = useInfiniteQuery(
    queryKey,
    async ({ pageParam = 1 }) => fetchAssignPriceData(
        pageParam,
        50,
        filters?.prNo,
        filters?.fromDate,
        filters?.toDate,
        filters?.department,
        filters?.requester,
      ),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 50 ? allPages.length + 1 : undefined,
      staleTime: 60 * 1000,
    },
  );

  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  return {
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    refetch,
    fetchNextPage,
    isError,
  };
}
