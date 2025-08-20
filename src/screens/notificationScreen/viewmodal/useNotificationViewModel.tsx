import { useState, useMemo, useCallback, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Pagination } from '@/screens/approvePrScreen/modal/ApproveModal';
import {
  IItemNotification,
  checkReadAllNotification,
  checkReadNotification,
  fetchNotificationData,
} from '../modal/notificationModel';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import { useTotalNotificationNoRead } from '@/zustand/store/useTotalNotificationNoRead/useTotalNotificationNoRead';

const ITEMS_PER_PAGE = 50;

interface PageData {
  data: IItemNotification[];
  pagination: Pagination;
}

export function useNotificationViewModel() {
  const [totalItemsNoRead, setTotalItemsNoRead] = useState<number>(0);
  const { showToast, showLoading, hideLoading } = useAlert();
  const { setTotal, totalNotification } = useTotalNotificationNoRead();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['listNotifications'], []);

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
  } = useInfiniteQuery<PageData, Error>({
    queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchNotificationData(pageParam as number, ITEMS_PER_PAGE),
    getNextPageParam: lastPage => {
      const nextPage = lastPage.pagination?.pageCurrent + 1;
      return nextPage <= lastPage.pagination?.pageCount ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data?.pages[0]?.pagination?.totalNoRead !== undefined) {
      setTotalItemsNoRead(data.pages[0].pagination.totalNoRead);
    } else {
      setTotalItemsNoRead(0);
    }
  }, [data?.pages[0]?.pagination?.totalNoRead]);

  const flatData = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

  const onRefresh = useCallback(() => {
    if (isFetching || isRefetching || isLoading) {
      return;
    }
    refetch();
  }, [isFetching, isLoading, isRefetching, refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  /**
   * Cập nhật trạng thái isRead của một hoặc tất cả thông báo trong cache
   * và giảm totalItemsNoRead.
   * @param ids Mảng các id thông báo cần cập nhật. Nếu không có, cập nhật tất cả.
   */
  const updateIsReadInCache = useCallback(
    (ids?: number[]) => {
      // Sử dụng `setTotalItemsNoRead` với một hàm callback để đảm bảo
      // giá trị luôn được cập nhật dựa trên state mới nhất
      let itemsToMarkAsReadCount = 0;

      queryClient.setQueryData<InfiniteData<PageData>>(queryKey, cachedData => {
        if (!cachedData) {
          return undefined;
        }

        const newPages = cachedData.pages.map(page => ({
          ...page,
          data: page.data.map(item => {
            const shouldUpdate = !ids || ids.includes(item.id);
            if (shouldUpdate && !item.isRead) {
              itemsToMarkAsReadCount++; // Đếm số lượng item sẽ được cập nhật
              return { ...item, isRead: true };
            }
            return item;
          }),
        }));

        return { ...cachedData, pages: newPages };
      });

      // Giảm totalItemsNoRead sau khi cache đã được cập nhật
      // Math.max để đảm bảo giá trị không nhỏ hơn 0
      if (ids?.length === 0) {
        setTotal(0);
      } else {
        setTotal(Math.max(0, totalNotification - itemsToMarkAsReadCount));
      }
      // setTotalItemsNoRead(prev => Math.max(0, prev - itemsToMarkAsReadCount));
    },
    [queryClient, queryKey, setTotal, totalNotification],
  );

  const onRead = useCallback(
    async (id: number) => {
      try {
        const { isSuccess, message } = await checkReadNotification(id);
        if (!isSuccess) {
          showToast(message || t('error.subtitle'), 'error');
          return;
        }
        updateIsReadInCache([id]);
        // fetData();
        // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
      } catch (error) {
        showToast(t('error.subtitle'), 'error');
      }
    },
    [showToast, t, updateIsReadInCache],
  );

  const onReadAll = useCallback(async () => {
    try {
      showLoading();
      const { isSuccess, message } = await checkReadAllNotification();
      if (!isSuccess) {
        showToast(message || t('error.subtitle'), 'error');
        return;
      }
      // fetData();
      updateIsReadInCache(); // Gọi mà không có id sẽ cập nhật tất cả
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      showToast(t('error.subtitle'), 'error');
    } finally {
      hideLoading();
    }
  }, [showLoading, updateIsReadInCache, showToast, t, hideLoading]);

  return {
    flatData,
    isLoading,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    totalItemsNoRead: totalItemsNoRead || 0,
    isError,
    error,
    onRefresh,
    onLoadMore,
    onReadAll,
    onRead,
  };
}
