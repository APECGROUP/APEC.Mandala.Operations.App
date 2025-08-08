import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IItemStatus } from '@/zustand/store/useStatusGlobal/useStatusGlobal';

export const fetchStatusData = async (page: number, limit: number = 50): Promise<IItemStatus> => {
  try {
    const params = {
      pagination: {
        pageIndex: page,
        pageSize: limit,
        isAll: false,
      },
    };
    const response = await api.get<IItemStatus, any>(ENDPOINT.GET_STATUS_GLOBAL, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
