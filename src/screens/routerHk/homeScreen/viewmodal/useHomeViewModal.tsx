// src/hooks/useHomeViewModal.ts
import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPaginatedFloorData, FloorData, PaginatedFloorResponse } from '../modal/HomeModal';
import { useHk } from '@/zustand/store/useHk/useHk';

const FLOORS_PER_PAGE = 20;

/**
 * Custom hook quản lý dữ liệu và logic cho màn hình Housekeeping Home.
 */
export function useHomeViewModal() {
  // Lấy các state và actions từ Zustand store
  const {
    selectedRoom,
    buildingSelected,
    floorSelected,
    isAll,
    setSelectedRoom,
    setBuildingSelected,
    setFloorSelected,
    setIsAll,
    onPressBuilding,
    onPressLocation,
    onPressAll,
    onPressPriority,
    onPressMinibar,
    onPressCo,
    onPressBroken,
    onPressLost,
  } = useHk();

  // useInfiniteQuery vẫn được giữ nguyên để xử lý fetching data
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
  } = useInfiniteQuery<PaginatedFloorResponse, Error>({
    queryKey: ['listHome', selectedRoom, buildingSelected, floorSelected, isAll],
    queryFn: async ({ pageParam = 1 }) =>
      fetchPaginatedFloorData(pageParam as number, FLOORS_PER_PAGE),
    getNextPageParam: lastPage =>
      lastPage.currentPage === lastPage.totalPages ? undefined : lastPage.currentPage + 1,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const flatFloors: FloorData[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.data || []);
  }, [data]);

  // Các hàm onRefresh và onLoadMore vẫn cần ở đây vì chúng tương tác trực tiếp với useInfiniteQuery
  const onRefresh = () => refetch();

  const onLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    // Dữ liệu và trạng thái từ useInfiniteQuery
    data: flatFloors,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    isError,
    error,
    hasNextPage,
    onRefresh,
    onLoadMore,

    // Dữ liệu và hàm từ Zustand store
    selectedRoom,
    setSelectedRoom,
    isAll,
    setIsAll,
    onPressBuilding,
    onPressLocation,
    onPressAll,
    onPressPriority,
    onPressMinibar,
    onPressCo,
    onPressBroken,
    onPressLost,
    buildingSelected,
    floorSelected,
    setBuildingSelected,
    setFloorSelected,
  };
}
