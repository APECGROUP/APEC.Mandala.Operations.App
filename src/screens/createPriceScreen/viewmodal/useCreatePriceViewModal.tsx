// views/viewmodal/useCreatePriceViewModal.ts

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  TypeCreatePrice,
  fetchCreatePrice,
  CreatePriceFilters, // Bạn cần đảm bảo TypeCreatePrice và CreatePriceFilters được cập nhật để sử dụng 'prNo'
  clearCreatePriceCache,
} from '../modal/CreatePriceModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500; // Tăng thời gian debounce để hiệu quả hơn với nhiều filter

// Giả định bạn đã cập nhật CreatePriceFilters trong CreatePriceModal.ts như sau:
// export interface CreatePriceFilters {
//   prNo?: string; // Đổi từ searchKey sang prNo
//   fromDate?: Date;
//   toDate?: Date;
//   department?: { id: string; name: string };
//   requester?: { id: string; name: string };
// }

export function useCreatePriceViewModel(initialFilters: CreatePriceFilters = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { showToast } = useAlert();
  const [effectiveFilters, setEffectiveFilters] = useState<CreatePriceFilters>(initialFilters);
  const [currentUiFilters, setCurrentUiFilters] = useState<CreatePriceFilters>(initialFilters);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const debouncedSetEffectiveFiltersRef = useRef<ReturnType<
    typeof debounce<typeof setEffectiveFilters>
  > | null>(null);

  useEffect(() => {
    if (!debouncedSetEffectiveFiltersRef.current) {
      debouncedSetEffectiveFiltersRef.current = debounce(setEffectiveFilters, DEBOUNCE_DELAY);
    }
    return () => {
      debouncedSetEffectiveFiltersRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    debouncedSetEffectiveFiltersRef.current?.(currentUiFilters);
  }, [currentUiFilters]);

  // queryKey giờ sẽ dùng effectiveFilters.prNo
  const queryKey = useMemo(
    () => [
      'listCreatePrice',
      effectiveFilters.prNo?.trim() || '', // Thay searchKey bằng prNo
      effectiveFilters.fromDate?.toISOString() || '',
      effectiveFilters.toDate?.toISOString() || '',
      effectiveFilters.department?.id || '',
      effectiveFilters.requester?.id || '',
    ],
    [effectiveFilters],
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
  } = useInfiniteQuery<TypeCreatePrice[], Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchCreatePrice(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  const onRefresh = useCallback(() => {
    console.log('onRefresh called from ViewModel. Forcing refetch.');
    clearCreatePriceCache();
    refetch();
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    console.log('onLoadMore called.');
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // onSearch bây giờ cập nhật prNo
  const onSearch = useCallback((val: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: val })); // Thay searchKey bằng prNo
  }, []);

  const applyFilters = useCallback((newFilter: CreatePriceFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilter);
    setEffectiveFilters(newFilter);
  }, []);

  const { showAlert } = useAlert();
  const onDelete = useCallback(
    async (id: string, onSuccess?: (deletedId: string) => void) => {
      const currentQueryKey = [
        'listCreatePrice',
        effectiveFilters.prNo?.trim() || '', // Thay searchKey bằng prNo
        effectiveFilters.fromDate?.toISOString() || '',
        effectiveFilters.toDate?.toISOString() || '',
        effectiveFilters.department?.id || '',
        effectiveFilters.requester?.id || '',
      ];

      const cached = queryClient.getQueryData<InfiniteData<TypeCreatePrice[]>>(currentQueryKey);
      if (!cached) {
        console.warn('🟥 No cache found for key:', currentQueryKey);
        return false;
      }

      try {
        if (Number(id) % 5 !== 0) {
          console.log('✅ Deleting item successfully...');
          queryClient.setQueryData(currentQueryKey, {
            ...cached,
            pages: cached.pages.map(page => page.filter(item => item.id !== id) || []),
          });

          onSuccess?.(id);
          return true;
        } else {
          await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
          showAlert(t('createPrice.warningRemove'), '', [
            {
              text: t('createPrice.close'),
              onPress: () => {},
            },
          ]);
          return false;
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        return false;
      }
    },
    [queryClient, effectiveFilters, showAlert, t],
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

  const onApproved = useCallback(
    async (ids: string[]) => {
      // Xoá các item có id nằm trong danh sách ids khỏi cache
      const currentQueryKey = [
        'listCreatePrice',
        effectiveFilters.prNo?.trim() || '',
        effectiveFilters.fromDate?.toISOString() || '',
        effectiveFilters.toDate?.toISOString() || '',
        effectiveFilters.department?.id || '',
        effectiveFilters.requester?.id || '',
      ];
      const cached = queryClient.getQueryData(currentQueryKey);
      if (cached && cached.pages) {
        // Loại bỏ các item có id nằm trong ids khỏi từng page
        const newPages = cached.pages.map((page: TypeCreatePrice[]) =>
          page.filter(item => !ids.includes(item.id)),
        );
        queryClient.setQueryData(currentQueryKey, {
          ...cached,
          pages: newPages,
        });
        setSelectedIds([]);
      }
      showToast(t('createPrice.approvedSuccess'), 'success');
       
    },
    [queryClient, effectiveFilters, t, showToast],
  );
  const onReject = useCallback(
    async (ids: string[]) => {
      // Xoá các item có id nằm trong danh sách ids khỏi cache
      const currentQueryKey = [
        'listCreatePrice',
        effectiveFilters.prNo?.trim() || '',
        effectiveFilters.fromDate?.toISOString() || '',
        effectiveFilters.toDate?.toISOString() || '',
        effectiveFilters.department?.id || '',
        effectiveFilters.requester?.id || '',
      ];
      const cached = queryClient.getQueryData(currentQueryKey);
      if (cached && cached.pages) {
        // Loại bỏ các item có id nằm trong ids khỏi từng page
        const newPages = cached.pages.map((page: TypeCreatePrice[]) =>
          page.filter(item => !ids.includes(item.id)),
        );
        queryClient.setQueryData(currentQueryKey, {
          ...cached,
          pages: newPages,
        });
        setSelectedIds([]);
      }
      showToast(t('createPrice.rejectSuccess'), 'success');
       
    },
    [queryClient, effectiveFilters, t, showToast],
  );

  return {
    onReject,
    selectedIds,
    setSelectedIds,
    onApproved,
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onRefresh,
    onLoadMore,
    onSearch,
    applyFilters,
    handleDelete,
    currentPrNoInput: currentUiFilters.prNo || '', // Thay searchKey bằng prNo
    currentFilters: currentUiFilters,
    isError,
    error,
  };
}
