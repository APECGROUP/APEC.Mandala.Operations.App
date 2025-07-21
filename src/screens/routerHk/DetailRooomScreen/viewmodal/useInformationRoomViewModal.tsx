import { useQuery } from '@tanstack/react-query';
import { getRoomDetail } from '../modal/InformationRoomModal';
import { useCallback, useState } from 'react';
import { useAlert } from '@/elements/alert/AlertProvider';
import { ROOM_STATUSES, RoomStatus } from '../view/component/constants';
import { push } from '@/navigation/RootNavigation';

const useInformationRoomViewModal = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roomDetail', id],
    queryFn: () => getRoomDetail(id),
  });

  const { showAlert } = useAlert();
  const [status, setStatus] = useState<RoomStatus>(ROOM_STATUSES[0]);
  const changeStatus = useCallback(
    (item: RoomStatus) => {
      showAlert(
        'Đổi trạng thái',
        `Bạn có chắc chắn muốn đổi từ trạng thái ${status.name} sang “${item.name}” không?`,
        [
          {
            text: 'Hủy bỏ',
            onPress: () => push('InformationRoomScreen', { id }),
            style: 'cancel',
          },
          {
            text: 'Tôi chắc chắn',
            onPress: () => {
              setStatus(item);
              push('InformationRoomScreen', { id });
            },
          },
        ],
      );
    },
    [id, showAlert, status.name],
  );
  return { data, isLoading, error, changeStatus, status };
};

export default useInformationRoomViewModal;
