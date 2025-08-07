import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';

export interface IResponseListRequester {
  data: IPickRequester[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IPickRequester {
  username: string;
  displayName: string;
  status: string;
  supperUser: string;
  ipAddress: null;
  email: null;
  caUsername: string;
  description: null;
  userType: string;
  brid: null;
  department: null;
  language: null;
  isNotification: null;
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

export const fetchRequesterData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickRequester> => {
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
    const response = await api.post<IResponseListRequester, any>(
      ENDPOINT.GET_LIST_REQUESTER,
      params,
    );
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
