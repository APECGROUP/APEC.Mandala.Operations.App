import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';

export interface IResponseListLocal {
  data: IPickLocal[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IPickLocal {
  storeCode: string;
  storeName: string;
  costAcc: string;
  description: null;
  stockType: null;
  id: number;
  createdBy: string;
  createdDate: Date;
  deletedDate: null;
  deletedBy: null;
  deleted: string;
}

export interface Pagination {
  pageCurrent: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  firstRowOnPage: number;
  lastRowOnPage: number;
}

/**
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 */

export const fetchPickLocalData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickLocal[]> => {
  try {
    const params = {
      pagination: {
        pageIndex: page,
        pageSize: limit,
        isAll: false,
      },
      filter: {
        textSearch: key.trim(),
      },
    };
    const response = await api.post<IResponseListLocal>(ENDPOINT.GET_LIST_LOCATION, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
