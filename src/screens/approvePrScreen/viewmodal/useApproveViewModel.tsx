import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  IApprove,
  IApproveFilters,
  checkApprovePrNoChange,
  checkRejectPr,
  fetchApprove,
  Pagination,
} from '../modal/ApproveModal';
import debounce from 'lodash/debounce';
import { useAlert } from '@/elements/alert/AlertProvider';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Images from '@assets/image/Images';
import { s } from 'react-native-size-matters';
import { goBack } from '@/navigation/RootNavigation';

const ITEMS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 500;

interface PageData {
  data: IApprove[];
  pagination: Pagination;
}

export function useApproveViewModel(initialFilters: IApproveFilters = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showToast, showAlert } = useAlert();

  const [effectiveFilters, setEffectiveFilters] = useState<IApproveFilters>(initialFilters);
  const [currentUiFilters, setCurrentUiFilters] = useState<IApproveFilters>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [textReason, setTextReason] = useState<string>();
  const [totalItems, setTotalItems] = useState<number>(0);

  const isDisableButtonReject = useMemo(() => textReason?.trim() === '', [textReason]);

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

  const queryKey = useMemo(
    () => [
      'listApprove',
      effectiveFilters.prNo?.trim() || '',
      effectiveFilters.prDate?.toISOString() || '',
      effectiveFilters.expectedDate?.toISOString() || '',
      effectiveFilters.department?.id || '',
      effectiveFilters.requester?.id || '',
      effectiveFilters.store?.id || '',
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
  } = useInfiniteQuery<PageData, Error>({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      fetchApprove(pageParam as number, ITEMS_PER_PAGE, effectiveFilters),
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
    if (data?.pages[0]?.pagination?.rowCount !== undefined) {
      setTotalItems(data.pages[0].pagination.rowCount);
    } else {
      setTotalItems(0);
    }
  }, [data]);

  const flatData = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onSearch = useCallback((val: string) => {
    setCurrentUiFilters(prev => ({ ...prev, prNo: val }));
  }, []);

  const applyFilters = useCallback((newFilter: IApproveFilters) => {
    debouncedSetEffectiveFiltersRef.current?.cancel();
    setCurrentUiFilters(newFilter);
    setEffectiveFilters(newFilter);
  }, []);

  const updateCacheAndTotal = useCallback(
    (action: (item: IApprove) => boolean, totalItem: number = 1) => {
      queryClient.setQueryData(queryKey, (cachedData: InfiniteData<PageData> | undefined) => {
        if (!cachedData) {
          return undefined;
        }

        const newPages = cachedData.pages.map(page => ({
          ...page,
          data: page.data.filter(action),
          pagination: {
            ...page.pagination,
            rowCount: page.pagination.rowCount - totalItem,
          },
        }));

        setTotalItems(prev => prev - totalItem);

        return { ...cachedData, pages: newPages };
      });
    },
    [queryClient, queryKey],
  );

  const onDelete = useCallback(
    async (id: string, onSuccess?: (deletedId: string) => void) => {
      const cached = queryClient.getQueryData<InfiniteData<PageData>>(queryKey);
      if (!cached) {
        return false;
      }

      try {
        if (Number(id) % 5 !== 0) {
          updateCacheAndTotal(item => Number(item.id) !== Number(id), 1);
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
        return false;
      }
    },
    [queryClient, queryKey, showAlert, t, updateCacheAndTotal],
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
            await onDelete(id, onSuccess);
          },
        },
      ]);
    },
    [showAlert, t, onDelete],
  );

  const onRejectSuccess = () => {
    showAlert(
      t('informationItem.rejectSuccess'),
      '',
      [
        {
          text: t('Trở về'),
          onPress: goBack,
        },
      ],
      <FastImage
        source={Images.ModalApprovedError}
        style={{ width: s(285), aspectRatio: 285 / 187 }}
      />,
    );
  };

  const onApproved = useCallback(
    async (ids: number[]) => {
      const { isSuccess, message } = await checkApprovePrNoChange(ids[0]);
      if (!isSuccess) {
        return showToast(message || t('createPrice.approvedFail'), 'error');
      }

      updateCacheAndTotal(item => !ids.includes(item.id), ids.length);
      setSelectedIds([]);
      showToast(t('createPrice.approvedSuccess'), 'success');
    },
    [showToast, t, updateCacheAndTotal],
  );

  const onReject = useCallback(
    async (ids: number[], func?: () => void) => {
      setIsLoadingConfirm(true);
      const { isSuccess, message } = await checkRejectPr(ids[0], textReason || '');

      if (!isSuccess) {
        setIsLoadingConfirm(false);
        return showToast(message || t('createPrice.rejectFail'), 'error');
      }

      updateCacheAndTotal(item => !ids.includes(item.id), ids.length);
      setSelectedIds([]);

      setIsLoadingConfirm(false);
      if (func) {
        func();
      }
      onRejectSuccess();
    },
    [textReason, showToast, t, updateCacheAndTotal],
  );

  return {
    length: totalItems,
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
    currentPrNoInput: currentUiFilters.prNo || '',
    currentFilters: currentUiFilters,
    isError,
    error,
    isLoadingConfirm,
    textReason,
    setTextReason,
    isDisableButtonReject,
  };
}
