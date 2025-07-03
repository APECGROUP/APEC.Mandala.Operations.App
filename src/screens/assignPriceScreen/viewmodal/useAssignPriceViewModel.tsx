import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  AssignPriceFilters,
  DataAssignPrice,
  fetchAssignPriceData,
} from '../modal/AssignPriceModal';
import debounce from 'lodash/debounce';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500; // Tăng thời gian debounce để hiệu quả hơn với nhiều filter

/**
 * Custom hook để quản lý trạng thái và fetching dữ liệu cho trang Assign Price.
 *
 * @param initialFilters Các bộ lọc mặc định ban đầu được truyền vào từ màn hình chính.
 */
export function useAssignPriceViewModel(initialFilters: AssignPriceFilters = {}) {
  // `effectiveFilters` là state chứa các giá trị filter thực tế sẽ được sử dụng để fetch data.
  // Các giá trị này sẽ được cập nhật sau khi debounce từ `currentUiFilters`.
  const [effectiveFilters, setEffectiveFilters] = useState<AssignPriceFilters>(initialFilters);

  // `currentUiFilters` là state tạm thời, lưu trữ các giá trị filter mà người dùng
  // đang tương tác (gõ vào ô search, chọn trên màn hình filter).
  // Những giá trị này sẽ được debounce trước khi cập nhật vào `effectiveFilters`.
  const [currentUiFilters, setCurrentUiFilters] = useState<AssignPriceFilters>(initialFilters);

  // Ref để lưu trữ hàm debounce, đảm bảo nó chỉ được tạo một lần duy nhất
  // và có thể được hủy bỏ (cancel) khi component unmount.
  const debouncedSetEffectiveFiltersRef = useRef<ReturnType<
    typeof debounce<typeof setEffectiveFilters>
  > | null>(null);

  // Khởi tạo hàm debounce khi component mount.
  // Đảm bảo hàm debounce được tạo một lần và hủy bỏ khi unmount để tránh memory leaks.
  useEffect(() => {
    if (!debouncedSetEffectiveFiltersRef.current) {
      debouncedSetEffectiveFiltersRef.current = debounce(setEffectiveFilters, DEBOUNCE_DELAY);
    }
    return () => {
      debouncedSetEffectiveFiltersRef.current?.cancel();
    };
  }, []);

  // Effect để cập nhật `effectiveFilters` từ `currentUiFilters` sau khi debounce.
  // Mỗi khi `currentUiFilters` thay đổi (người dùng tương tác), hàm debounce sẽ được gọi.
  // Nếu `currentUiFilters` thay đổi nhanh, debounce sẽ ngăn việc gọi `setEffectiveFilters` liên tục.
  useEffect(() => {
    // Gọi hàm debounce để cập nhật effectiveFilters.
    // Nếu có các cuộc gọi debounce trước đó chưa được thực thi, chúng sẽ bị hủy bỏ.
    debouncedSetEffectiveFiltersRef.current?.(currentUiFilters);
  }, [currentUiFilters]); // Dependency là currentUiFilters, chạy lại khi UI filters thay đổi.

  // `queryKey` được tạo dựa trên các giá trị `effectiveFilters` cuối cùng đã được debounce.
  // Điều này đảm bảo TanStack Query sẽ re-fetch chỉ khi các filter thực sự thay đổi giá trị.
  const queryKey = useMemo(
    () => [
      'listAssignPrice',
      effectiveFilters.prNo?.trim() || '',
      effectiveFilters.fromDate?.toISOString() || '',
      effectiveFilters.toDate?.toISOString() || '',
      effectiveFilters.department?.id || '',
      effectiveFilters.requester?.id || '',
    ],
    [effectiveFilters], // Dependency là toàn bộ object effectiveFilters
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
  } = useInfiniteQuery<DataAssignPrice[], Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      // pageParam mặc định là 1
      fetchAssignPriceData(
        pageParam as number,
        ITEMS_PER_PAGE,
        effectiveFilters, // Truyền toàn bộ object filters vào fetchAssignPriceData
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000, // Dữ liệu được coi là "stale" sau 1 phút
    refetchOnWindowFocus: false, // Tắt re-fetch khi focus lại cửa sổ để tránh gọi API không cần thiết
    refetchOnMount: false, // Tắt re-fetch khi component mount lần đầu
  });

  // Gộp dữ liệu từ tất cả các trang thành một mảng phẳng để dễ dàng hiển thị.
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  // Xử lý sự kiện refresh (kéo xuống để làm mới).
  const onRefresh = useCallback(() => {
    console.log('onRefresh', isFetching, isRefetching, isLoading);
    // Tránh gọi refetch nếu đang trong quá trình fetching để tránh các race conditions.
    if (isFetching || isRefetching || isLoading) {
      console.log('đang fetch');
      return;
    }
    refetch();
  }, [isFetching, isLoading, isRefetching, refetch]);

  // Xử lý sự kiện tải thêm dữ liệu (cuộn cuối danh sách).
  const onLoadMore = useCallback(() => {
    console.log('onLoadMore', hasNextPage, isFetchingNextPage, isLoading);
    // Chỉ fetchNextPage nếu có trang tiếp theo, không đang fetching và không đang loading.
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Cập nhật giá trị `prNo` trong `currentUiFilters`.
  // Hàm này sẽ được gọi trực tiếp khi người dùng gõ vào ô tìm kiếm trên màn hình chính.
  const onSearchPrNo = useCallback((key: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: key }));
  }, []);

  // Cập nhật toàn bộ object `currentUiFilters` với các bộ lọc mới.
  // Hàm này được dùng khi người dùng áp dụng filter từ `FilterScreen`.
  // Nó sẽ reset `effectiveFilters` và kích hoạt re-fetch mới.
  const applyFilters = useCallback((newFilters: AssignPriceFilters) => {
    // Ngay lập tức cập nhật `currentUiFilters` và `effectiveFilters` để UI và query đồng bộ.
    // Hủy bỏ mọi debounce đang chờ xử lý để áp dụng filter ngay lập tức.
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
    onRefresh,
    onLoadMore,
    onSearchPrNo,
    applyFilters, // Đổi tên thành applyFilters cho rõ ràng
    currentPrNoInput: currentUiFilters.prNo || '', // Giá trị hiện tại trong ô input tìm kiếm trên màn hình chính
    currentFilters: currentUiFilters, // Toàn bộ object filter đang được người dùng tương tác
    isError,
    error,
  };
}
