import { useQuery } from '@tanstack/react-query';
import { getRoomDetail } from '../modal/InformationRoomModal';

const useInformationRoomViewModal = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roomDetail', id],
    queryFn: () => getRoomDetail(id),
  });
  return { data, isLoading, error };
};

export default useInformationRoomViewModal;
