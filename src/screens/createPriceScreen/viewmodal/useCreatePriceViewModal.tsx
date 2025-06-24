import { useState, useMemo, useCallback, useRef } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { TypeCreatePrice, fetchCreatePrice } from '../modal/CreatePriceModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 300;

export function useCreatePriceViewModel() {
  const { t } = useTranslation();
  const [searchKey, setSearchKey] = useState<string>('');
  const queryClient = useQueryClient();
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

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
  } = useInfiniteQuery<TypeCreatePrice[], Error>({
    queryKey: ['listCreatePrice', searchKey.trim()],
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return fetchCreatePrice(page, ITEMS_PER_PAGE, searchKey.trim());
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
  });

  // Gộp data các page lại thành 1 mảng
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);
  // console.log('render useAssignPriceViewModel');
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
  //   const handleExpand = (id: number | string) => {
  //     const cached = queryClient.getQueryData<InfiniteData<TypeCreatePrice[]>>([
  //       'listCreatePrice',
  //       searchKey.trim(),
  //     ]);

  //     if (!cached) {
  //       console.warn('🟥 No cache found for key:', [
  //         'listCreatePrice',
  //         searchKey.trim(),
  //       ]);
  //       return;
  //     }

  //     console.log('✅ Updating price...');
  //     queryClient.setQueryData(['listCreatePrice', searchKey.trim()], {
  //       ...cached,
  //       pages: cached.pages.map(page =>
  //         page.map(item =>
  //           item.id === id ? {...item, expanded: !item.expanded} : item,
  //         ),
  //       ),
  //     });
  //   };
  const { showAlert } = useAlert();
  const onDelete = useCallback(
    async (id: string, onSuccess?: (deletedId: string) => void) => {
      const cached = queryClient.getQueryData<InfiniteData<TypeCreatePrice[]>>([
        'listCreatePrice',
        searchKey.trim(),
      ]);
      if (!cached) {
        console.warn('🟥 No cache found for key:', ['listCreatePrice', searchKey.trim()]);
        return false;
      }

      try {
        if (Number(id) % 5 !== 0) {
          console.log('✅ Deleting item successfully...');
          queryClient.setQueryData(['listCreatePrice', searchKey.trim()], {
            ...cached,
            pages: cached.pages.map(page => page.filter(item => item.id !== id) || []),
          });

          // Gọi callback khi xóa thành công
          onSuccess?.(id);
          return true;
        } else {
          // Simulate failed delete
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
    [queryClient, searchKey, showAlert, t],
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
    onSearch,
    // handleExpand,
    handleDelete,
    searchKey,
  };
}
