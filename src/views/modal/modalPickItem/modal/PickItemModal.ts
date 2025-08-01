import api from '@/utils/setup-axios';
import { ENDPOINT } from '@/utils/Constans';

export interface IResponsePickItem {
  data: IPickItem[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IPickItem {
  iCode: string;
  iName: string;
  printName: string;
  sgCode: string;
  groupCode: string;
  iUnit: number;
  unitName: string;
  maxRequest: number;
  minRequest: number;
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
export const fetchPickItemData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickItem[]> => {
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
    const response = await api.post<IResponsePickItem>(ENDPOINT.GET_LIST_ITEM, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
