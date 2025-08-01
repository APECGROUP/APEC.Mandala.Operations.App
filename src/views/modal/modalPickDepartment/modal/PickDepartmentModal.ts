import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';

export interface IResponseDepartment {
  data: IPickDepartment[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IPickDepartment {
  departmentCode: string;
  departmentName: string;
  departmentShortName: string;
  location: string;
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

export const fetchDepartmentData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickDepartment[]> => {
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
    const response = await api.post<IResponseDepartment>(ENDPOINT.GET_LIST_DEPARTMENT, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
