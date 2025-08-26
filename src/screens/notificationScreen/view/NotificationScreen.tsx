// views/NotificationScreen.tsx

import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';

import { MainParams } from '@/navigation/params';
import { AppBlock } from '@/elements/block/Block';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import IconScrollBottom from '@assets/icon/IconScrollBottom';

import light from '@/theme/light';
import { IItemNotification } from '../modal/notificationModel';
import { useNotificationViewModel } from '../viewmodal/useNotificationViewModel';
import ItemNotification from './component/ItemNotification';
import Header from './component/Header';
import { AppText } from '@/elements/text/AppText';
import { FlashList } from '@shopify/flash-list';
import IconSeeAll from '@assets/icon/IconSeeAll';
import { getFontSize } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack, navigate } from '@/navigation/RootNavigation';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { useTotalNotificationNoRead } from '@/zustand/store/useTotalNotificationNoRead/useTotalNotificationNoRead';
import { checkApprovePr, IApprove } from '@/screens/approvePrScreen/modal/ApproveModal';
import { useAlert } from '@/elements/alert/AlertProvider';
export const GROUP_ROLES = {
  // Định nghĩa các hằng số vai trò để tránh magic numbers và dễ đọc hơn
  PC_PR_VIEWER: 9,
  PO_CREATOR_ASSIGNER: 11,
  PR_APPROVER: {
    TBP: 10, // Trưởng bộ phận
    KTT: 12, // Kế toán trưởng
    OM_GM: 13, // OM/GM
  },
  ADMIN: 14,
};
type Props = NativeStackScreenProps<MainParams, 'NotificationScreen'>;
const ICON_SECTION_WIDTH = s(130);
export const formatNotificationCount = (count: number) => {
  if (!count || count <= 0) return '';
  if (count > 99) return '99+';
  return count < 10 ? `0${count}` : `${count}`;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  // ─── ViewModel (MVVM) ────────────────────────────────────────────────

  const {
    flatData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onLoadMore,
    isError,
    onRead,
    onReadAll,
  } = useNotificationViewModel();
  const { infoUser } = useInfoUser();
  // ─── Refs & shared values để show/hide nút cuộn ─────────────────────
  const { totalNotification, fetData } = useTotalNotificationNoRead();
const {showLoading,hideLoading,showToast}=useAlert()
  const flatListRef = useRef<FlashList<IItemNotification> | null>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // ─── Khi user nhấn vào 1 item, chuyển sang detail hoặc đánh dấu đã đọc ─────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: number) => {
    // TODO: gọi API xóa notification, rồi update listNotification
  };

  const onApproved = useCallback(
      async (id: number, listData: IApprove[]) => {
        try {
          showLoading();
          const { isSuccess, message } = await checkApprovePr(id, listData);
          if (!isSuccess) {
            return showToast(message || t('createPrice.approvedFail'), 'error');
          }
          goBack();
          DeviceEventEmitter.emit('refreshListApprove')
          showToast(t('createPrice.approvedSuccess'), 'success');
        } catch (error) {
        } finally {
          hideLoading();
        }
      },
      [hideLoading, showLoading, showToast, t],
    );

  const goToDetail = async (item:IItemNotification) => {
    const {status,id}=item
    const newItem={...item,id:item.prId||item.id}
    try {
      // Luồng 1: Cập nhật trạng thái thông báo
      // Gọi hàm để đánh dấu thông báo này là đã đọc, không ảnh hưởng đến luồng điều hướng
      onRead(id);

      // Luồng 2: Xử lý các trạng thái cần duyệt (PM, PA, PC)
      // Sử dụng Map để ánh xạ trạng thái với ID vai trò cụ thể cần duyệt
      const approvalRoutes = new Map<string, number>([
        ['PM', GROUP_ROLES.PR_APPROVER.TBP], // Nếu trạng thái chờ TBP duyệt là PM, cần vai trò TBP (10)
        ['PA', GROUP_ROLES.PR_APPROVER.KTT], // Nếu trạng thái chờ KTT duyệt là PA, cần vai trò KTT (12)
        ['PC', GROUP_ROLES.PR_APPROVER.OM_GM], // Nếu trạng thái chờ OM/GM duyệt là PC, cần vai trò OM/GM (13)
      ]);

      const requiredRole = approvalRoutes.get(status);

      // Kiểm tra xem trạng thái có nằm trong nhóm cần duyệt không
      // và người dùng hiện tại có vai trò cần thiết để duyệt hay không
      if (requiredRole && infoUser?.groups?.some(i => i.id === requiredRole)) {
        // Điều hướng đến màn hình duyệt đơn hàng
        return navigate('DetailOrderApproveScreen', { item:newItem, onApproved });
      }

      // Luồng 3: Xử lý trạng thái "Chờ gán giá" (PP)
      if (status === 'PP') {
        // Kiểm tra xem người dùng có vai trò được phép gán giá không
        const canAssignPrice = infoUser?.groups?.some(
          i =>
            // Nếu người dùng là ADMIN
            i.id === GROUP_ROLES.ADMIN ||
            // Hoặc có bất kỳ vai trò nào trong nhóm người duyệt
            Object.values(GROUP_ROLES.PR_APPROVER).includes(i.id),
        );
        if (canAssignPrice) {
          // Điều hướng đến màn hình gán giá
          return navigate('InformationItemsAssignPrice', {
            item:newItem,
            updateCacheAndTotal: () => {},
          });
        }
      }

      // Luồng 4: Xử lý các trạng thái còn lại
      // Nếu không khớp với bất kỳ điều kiện nào ở trên, điều hướng đến màn hình chi tiết thông thường
      navigate('InformationItemsPcPrScreen', { item:newItem });
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ vấn đề nào xảy ra trong quá trình điều hướng
      console.error('Error navigating:', error);
    }
  };
  // ─── Render mỗi item, với animation FadeInLeft.delay(index * 50) ─────────────────
  const renderItem = ({ item }: { item: IItemNotification }) => (
    <ItemNotification
      item={item}
      onDetail={() => goToDetail(item)}
      // onDetail={() => {
      //   if (!item.read) {
      //     onDetail(item.id);
      //   }
      //   navigate('DetailAssignPriceCardScreen', { item });
      // }}
      toggleRead={() => {
        // TODO: toggle read status local hoặc gọi API
      }}
      handleDelete={() => handleDelete(item.id)}
    />
  );
  // ─── Component khi list trống **và** đang không load trang >0 ─────────────
  const listEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={light.primary} />
        </View>
      );
    }
    return (
      <AppBlock flex center>
        <EmptyDataAnimation autoPlay />
        <AppText style={{ marginTop: vs(8) }}>{t('Không có thông báo')}</AppText>
      </AppBlock>
    );
  };

  const notificationLabel = formatNotificationCount(totalNotification);

  const rightComponent = () => (
    <TouchableOpacity style={styles.rightButton} onPress={onReadAll}>
      <IconSeeAll />
      <AppText numberOfLines={1} style={styles.rightText}>
        {t('Đọc tất cả')}
        {notificationLabel ? ` (${notificationLabel})` : ''}
      </AppText>
    </TouchableOpacity>
  );

  const listFooterComponent = useMemo(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={light.primary} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage]);

  useEffect(() => {
    fetData();
  }, []);

  if (isError) {
    return <FallbackComponent resetError={onRefresh} />;
  }

  return (
    <ViewContainer>
      <AppBlock flex>
        <Header rightComponent={rightComponent()} iconWidth={s(130)} />

        {/* ─── FlashList với Pagination, Loading, Empty State ───────────────── */}
        {isLoading && flatData.length === 0 ? (
          <View style={styles.listContentSkeleton}>
            {new Array(6).fill(0).map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </View>
        ) : (
          <FlashList
            ref={flatListRef}
            data={flatData || []}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}_${item.isRead}`}
            // extraData={flatData.map(item => item.read).join(',')}
            onEndReached={onLoadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            removeClippedSubviews
            refreshing={isRefetching}
            onRefresh={onRefresh}
            scrollEventThrottle={16}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            // estimatedItemSize={100}
            contentContainerStyle={styles.listContent}
          />
        )}

        <AppBlockButton onPress={scrollToTop} style={[styles.scrollButtonBase]}>
          <IconScrollBottom style={styles.rotateIcon} />
        </AppBlockButton>
      </AppBlock>
    </ViewContainer>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  rightButton: {
    width: ICON_SECTION_WIDTH,
    height: vs(40),
    flexDirection: 'row',
    paddingRight: PaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightText: {
    fontSize: getFontSize(12),
    marginLeft: s(4),
    fontWeight: '500',
    color: light.primary,
  },
  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },
  scrollButtonBase: {
    position: 'absolute',
    alignSelf: 'center',
    width: vs(33),
    height: vs(33),
    borderRadius: vs(24),
    backgroundColor: light.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    bottom: vs(70),
  },
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },
  emptyContainer: {
    flex: 1,
    marginTop: vs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: vs(50),
  },
  listContentSkeleton: {
    flexGrow: 1,
    paddingBottom: vs(50),
    marginTop: vs(10),
    paddingHorizontal: PaddingHorizontal,
  },
});
