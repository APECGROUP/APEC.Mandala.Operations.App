import {useQuery} from '@tanstack/react-query';
import {fetchDepartment, fetchRequester} from '../modal/FilterModal';

export const useFilterViewModel = () => {
  const departmentQuery = useQuery({
    queryKey: ['department'],
    queryFn: fetchDepartment,
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  const requesterQuery = useQuery({
    queryKey: ['requester'],
    queryFn: fetchRequester,
    staleTime: 1000 * 60 * 5,
  });

  return {
    listDepartment: departmentQuery.data || [],
    listRequester: requesterQuery.data || [],
  };
};
