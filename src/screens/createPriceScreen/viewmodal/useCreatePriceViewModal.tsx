// views/viewmodal/useCreatePriceViewModal.ts

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  TypeCreatePrice,
  fetchCreatePrice,
  CreatePriceFilters,
  clearCreatePriceCache,
} from '../modal/CreatePriceModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 300;

export function useCreatePriceViewModel() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // State giữ giá trị filter hiện tại (đã được áp dụng cho query)
  const [appliedFilters, setAppliedFilters] = useState<CreatePriceFilters>({});
  // State giữ giá trị input tìm kiếm trên UI (chưa debounce)
  const [currentSearchInput, setCurrentSearchInput] = useState<string>('');

  // Ref cho hàm debounce để có thể cancel
  const debouncedSetSearchKeyRef = useRef<ReturnType<
    typeof debounce<(_val: string) => void>
  > | null>(null);

  // Khởi tạo debounce và gán vào ref
  useEffect(() => {
    if (!debouncedSetSearchKeyRef.current) {
      debouncedSetSearchKeyRef.current = debounce((val: string) => {
        // Cập nhật searchKey trong appliedFilters, và reset page về 1
        setAppliedFilters(prev => ({ ...prev, searchKey: val }));
      }, DEBOUNCE_DELAY);
    }
    // Cleanup function để hủy debounce khi component unmount
    return () => {
      debouncedSetSearchKeyRef.current?.cancel();
    };
  }, []); // [] đảm bảo debounce chỉ được tạo một lần

  // Hàm xử lý thay đổi text trong ô tìm kiếm
  const onSearch = useCallback((val: string) => {
    setCurrentSearchInput(val); // Cập nhật giá trị hiển thị ngay lập tức
    debouncedSetSearchKeyRef.current?.(val); // Kích hoạt debounce để cập nhật filter thực tế
  }, []);

  // Lắng nghe `appliedFilters` để đảm bảo queryKey thay đổi khi filter được áp dụng
  // `queryKey` phải là một mảng ổn định, thay đổi khi và chỉ khi các giá trị lọc thay đổi
  const queryKey = useMemo(
    () => [
      'listCreatePrice',
      appliedFilters.searchKey?.trim() || '',
      appliedFilters.fromDate?.toISOString() || '',
      appliedFilters.toDate?.toISOString() || '',
      appliedFilters.department?.id || '',
      appliedFilters.requester?.id || '',
    ],
    [appliedFilters], // Dependency là appliedFilters để re-memoize khi filter thay đổi
  );

  // Infinite Query cho phân trang + search + filter
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
  } = useInfiniteQuery<TypeCreatePrice[], Error>({
    queryKey: queryKey, // Sử dụng queryKey đã memoize
    queryFn: async ({ pageParam = 1 }) => {
      // Mặc định pageParam là 1 nếu undefined
      // fetchCreatePrice sẽ nhận trực tiếp appliedFilters
      return fetchCreatePrice(pageParam as number, ITEMS_PER_PAGE, appliedFilters);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000, // Dữ liệu sẽ được coi là stale sau 1 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi focus lại cửa sổ
    refetchOnMount: false, // Không tự động refetch khi component mount lần đầu
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  // Refresh (kéo xuống)
  const onRefresh = useCallback(() => {
    console.log('onRefresh called from ViewModel. Forcing refetch.');
    // Luôn gọi clear cache thủ công của bạn trước khi refetch
    // Điều này đảm bảo API sẽ được gọi lại ngay cả khi TanStack Query cho rằng dữ liệu vẫn còn fresh
    clearCreatePriceCache();
    // refetch() sẽ kích hoạt lại queryFn, và queryFn sẽ gọi API nếu cache thủ công trống
    refetch();
  }, [refetch]); // Chỉ phụ thuộc vào refetch từ useInfiniteQuery

  // Load more (cuộn cuối danh sách)
  const onLoadMore = useCallback(() => {
    console.log('onLoadMore called.');
    // Bug fix: chỉ fetchNextPage nếu hasNextPage là true và không đang fetching
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Nhận filter object từ FilterScreen
  const applyFilters = useCallback((newFilter: CreatePriceFilters) => {
    console.log('Applying filters:', newFilter);
    // Hủy debounce search trước khi áp dụng bộ lọc mới để tránh xung đột
    debouncedSetSearchKeyRef.current?.cancel();
    setCurrentSearchInput(newFilter.searchKey || ''); // Cập nhật input search
    setAppliedFilters(newFilter); // Áp dụng bộ lọc mới, điều này sẽ kích hoạt refetch
  }, []);

  const { showAlert } = useAlert();
  const onDelete = useCallback(
    async (id: string, onSuccess?: (deletedId: string) => void) => {
      // Bug fix: queryKey cho getQueryData phải giống hệt queryKey trong useInfiniteQuery
      const currentQueryKey = [
        'listCreatePrice',
        appliedFilters.searchKey?.trim() || '',
        appliedFilters.fromDate?.toISOString() || '',
        appliedFilters.toDate?.toISOString() || '',
        appliedFilters.department?.id || '',
        appliedFilters.requester?.id || '',
      ];

      const cached = queryClient.getQueryData<InfiniteData<TypeCreatePrice[]>>(currentQueryKey);
      if (!cached) {
        console.warn('🟥 No cache found for key:', currentQueryKey);
        return false;
      }

      try {
        if (Number(id) % 5 !== 0) {
          // Giả lập thành công cho các id không chia hết cho 5
          console.log('✅ Deleting item successfully...');
          queryClient.setQueryData(currentQueryKey, {
            // Sử dụng currentQueryKey đã khớp
            ...cached,
            pages: cached.pages.map(page => page.filter(item => item.id !== id) || []),
          });

          onSuccess?.(id);
          return true;
        } else {
          // Simulate failed delete for ids divisible by 5
          await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
          showAlert(t('createPrice.warningRemove'), '', [
            {
              text: t('createPrice.close'),
              onPress: () => {},
            },
          ]);
          return false;
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        return false;
      }
    },
    [queryClient, appliedFilters, showAlert, t], // Thêm appliedFilters vào dependencies
  );

  const handleDelete = useCallback(
    (id: string, onSuccess?: (deletedId: string) => void) => {
      showAlert(t('createPrice.remove.title'), '', [
        {
          text: t('createPrice.remove.cancel'),
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: t('createPrice.remove.agree'),
          onPress: async () => {
            const success = await onDelete(id, onSuccess);
            if (!success) {
              console.log('❌ Delete failed, no action needed');
            }
          },
        },
      ]);
    },
    [showAlert, t, onDelete],
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
    onSearch, // Hàm onSearch để cập nhật input và debounce
    applyFilters,
    handleDelete,
    currentPrNoInput: currentSearchInput, // Giá trị input trên UI
    currentFilters: appliedFilters, // Filter hiện tại đã được áp dụng
    isError,
  };
}
