import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IPickLocal } from '@/views/modal/modalPickLocal/modal/PickLocalModal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';

export interface IApproveFilters {
  prNo?: string;
  prDate?: Date;
  expectedDate?: Date;
  department?: IPickDepartment | undefined;
  requester?: IPickRequester | undefined;
  store?: IPickLocal | undefined;
}

export interface IApprove {
  prNo: string;
  prDate: Date;
  expectedDate: Date;
  requestBy: string;
  userRequest: IPickRequester;
  departmentCode: string;
  departmentName: string;
  departmentShortName: string;
  storeCode: string;
  storedName: string;
  approveBy: null;
  approveLevel: null;
  approveDate: null;
  approveRemark: null;
  cancelBy: null;
  cancelDate: null;
  cancelReason: null;
  notAllowBy: null;
  notAllowDate: null;
  notAllowReason: null;
  marketListId: null;
  description: string;
  status: string;
  poNo: null;
  requestDate: Date;
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
  totalNoRead: number;
}

export interface IResponseListApprove {
  data: IApprove[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export type PaginationParams = {
  pageIndex: number;
  pageSize: number;
  isAll: boolean;
};

export type Filter = {
  propertyValue: string | number | boolean;
  propertyName: string;
  propertyType?: 'string' | 'number' | 'boolean' | 'datetime';
  operator?:
    | '=='
    | '!='
    | '>'
    | '>='
    | '<'
    | '<='
    | 'Contains'
    | 'In'
    | 'NotIn'
    | 'StartsWith'
    | 'EndsWith'
    | 'Like';
};

export type FilterGroup = {
  condition: 'And' | 'Or';
  filters: Filter[];
};

export type FilterRequest = {
  sort?: string;
  textSearch?: string;
  filterGroup?: FilterGroup[];
  moreFilterGroup?: FilterGroup[];
};

export type IParams = {
  pagination: PaginationParams;
  filter?: FilterRequest;
};

// Sửa kiểu trả về của hàm fetchApprove để khớp với cấu trúc dữ liệu thực tế
export const fetchApprove = async (
  page: number,
  limit: number = 50,
  filters: IApproveFilters,
): Promise<{ data: IApprove[]; pagination: Pagination }> => {
  try {
    const filterList: Filter[] = [];
    filterList.push({
      propertyName: 'status',
      propertyValue: 'PO',
      propertyType: 'string',
      operator: '!=',
    });
    filterList.push({
      propertyName: 'status',
      propertyValue: 'PP',
      propertyType: 'string',
      operator: '!=',
    });
    filterList.push({
      propertyName: 'status',
      propertyValue: 'AP',
      propertyType: 'string',
      operator: '!=',
    });
    if (filters.prDate) {
      filterList.push({
        propertyName: 'prDate',
        propertyValue: filters.prDate.toISOString(),
        propertyType: 'datetime',
        operator: '==',
      });
    }

    if (filters.expectedDate) {
      filterList.push({
        propertyName: 'expectedDate',
        propertyValue: filters.expectedDate.toISOString(),
        propertyType: 'datetime',
        operator: '==',
      });
    }

    if (filters.department?.departmentCode) {
      filterList.push({
        propertyName: 'departmentCode',
        propertyValue: filters.department.departmentCode,
        propertyType: 'string',
        operator: '==',
      });
    }

    if (filters.requester?.id) {
      filterList.push({
        propertyName: 'requestBy',
        propertyValue: filters.requester.username,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters.store?.id) {
      filterList.push({
        propertyName: 'storeCode',
        propertyValue: filters.store.storeCode,
        propertyType: 'string',
        operator: '==',
      });
    }

    const params: IParams = {
      pagination: {
        pageIndex: page,
        pageSize: limit,
        isAll: false,
      },
      filter: {
        textSearch: filters?.prNo?.trim(),
        ...(filterList.length > 0 && {
          filterGroup: [
            {
              condition: 'And',
              filters: filterList,
            },
          ],
        }),
      },
    };

    const response = await api.post<IResponseListApprove>(ENDPOINT.GET_LIST_APPOVE_PR, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    throw error;
  }
};

export const checkApprovePrNoChange = async (id: number) => {
  try {
    const response = await api.get(`${ENDPOINT.HANDLE_APPROVE_PR_NO_CHANGE}/${id}`);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: 'An error occurred while approving PR without changes.' };
  }
};
export const checkApprovePr = async (id: number, data: IApprove[]) => {
  try {
    const response = await api.post(`${ENDPOINT.HANDLE_APPROVE_PR}/${id}`, data);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: 'An error occurred while approving PR without changes.' };
  }
};
export const checkRejectPr = async (id: number, textReason: string) => {
  try {
    const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, textReason, {
      rawStringBody: true,
    });

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' };
  }
};
