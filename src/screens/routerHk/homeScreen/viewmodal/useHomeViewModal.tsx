import { useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchPaginatedFloorData,
  FloorData,
  PaginatedFloorResponse,
  RoomData,
} from '../modal/HomeModal';

const FLOORS_PER_PAGE = 20; // Số tầng mỗi trang, giống mặc định trong fetchPaginatedFloorData

/**
 * Custom hook quản lý phân trang danh sách tầng/phòng Housekeeping.
 * Không có filter tìm kiếm, chỉ phân trang.
 */
export function useHomeViewModal() {
  // Sử dụng useInfiniteQuery để lấy dữ liệu phân trang
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
     
    queryKey: ['listHome'],
    queryFn: async ({ pageParam = 1 }) =>
      // pageParam mặc định là 1
      fetchPaginatedFloorData(pageParam as number, FLOORS_PER_PAGE),
    getNextPageParam: lastPage =>
      lastPage.currentPage === lastPage.totalPages ? undefined : lastPage.currentPage + 1,
    initialPageParam: 1,
    staleTime: 60 * 1000, // Dữ liệu được coi là "stale" sau 1 phút
    refetchOnWindowFocus: false, // Tắt re-fetch khi focus lại cửa sổ để tránh gọi API không cần thiết
    refetchOnMount: false, // Tắt re-fetch khi component mount lần đầu
  });
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [isAll, setIsAll] = useState(true);

  // Gộp tất cả các trang thành một mảng phẳng các tầng
  const flatFloors: FloorData[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.data || []);
  }, [data]);

  // Hàm làm mới lại dữ liệu (refetch lại từ đầu)
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Hàm tải thêm trang tiếp theo
  const onLoadMore = useCallback(() => {
    // console.log('onLoadMore', hasNextPage, isFetchingNextPage, hasNextPage && !isFetchingNextPage);
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onPressBuilding = () => {
    console.log('onPressBuilding');
  };
  const onPressLocation = () => {
    console.log('onPressLocation');
  };
  const onPressAll = () => {
    console.log('onPressAll');
    setIsAll(true);
  };
  const onPressPriority = () => {
    console.log('onPressPriority');
    setIsAll(false);
  };
  const onPressMinibar = () => {
    console.log('onPressMinibar');
  };
  const onPressCo = () => {
    console.log('onPressCo');
  };
  const onPressBroken = () => {
    console.log('onPressBroken');
  };
  const onPressLost = () => {
    console.log('onPressLost');
  };
  return {
    data: flatFloors, // Mảng các tầng đã lấy được
    isLoading,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    isError,
    error,
    hasNextPage,
    onRefresh,
    onLoadMore,
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
  };
}
