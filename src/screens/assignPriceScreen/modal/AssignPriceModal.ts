import { IItemInDetailPr } from '@/screens/InformationItemScreen/modal/InformationItemsModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';
import { IItemStatus } from '@/zustand/store/useStatusGlobal/useStatusGlobal';
import { RefObject } from 'react';

export interface AssignPriceFilters {
  prNo?: string;
  prDate?: Date;
  expectedDate?: Date;
  department?: IPickDepartment | undefined;
  requester?: IPickRequester | undefined;
  product?: any;
  ncc?: IItemSupplier;
  status?: IItemStatus | undefined;
}

export interface IResponseListAssignPrice {
  data: IItemAssignPrice[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export interface IItemAssignPrice {
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
}
export type PaginationParams = {
  pageIndex: number; // trang hiện tại
  pageSize: number; // số lượng giá trị ở trang hiện tại
  isAll: boolean; // có muốn search tất cả hay không
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
  condition: 'And' | 'Or'; // kiểu so sánh giữa các filter
  filters: Filter[]; // danh sách các điều kiện tìm kiếm
};

export type FilterRequest = {
  sort?: string; // sắp xếp theo trường nào
  textSearch?: string; // tìm kiếm toàn văn
  filterGroup?: FilterGroup[]; // nhóm điều kiện chính
  moreFilterGroup?: FilterGroup[]; // thêm nhiều nhóm điều kiện khác nếu có
};

export type IParams = {
  pagination: PaginationParams;
  filter: FilterRequest;
};

export const fetchAutoAssign = async (id: number) => {
  try {
    const response = await api.post(`${ENDPOINT.AUTO_ASSIGN_PRICE}/${id}`, []);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '', data: response.data.data }; // Trả về dữ liệu đã phê duyệt
    } else {
      console.log('22', response.data.errors[0].message);
      return { isSuccess: false, message: response.data.errors[0].message }; // Trả về dữ liệu đã phê duyệt
    }
  } catch (error) {
    console.log('33');
    return {
      isSuccess: false,
      message: 'chạy vào catch rồi ',
    };
  }
};

export const fetchAssignPriceData = async (
  page: number,
  limit: number = 50,
  filters: AssignPriceFilters,
  length: RefObject<number>,
): Promise<IItemSupplier> => {
  try {
    const filterList: Filter[] = [];

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

    const response = await api.post<IItemAssignPrice, any>(ENDPOINT.GET_LIST_ASSIGN_PRICE, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    if (response.data.pagination.rowCount !== 0) {
      length.current = response.data.pagination.rowCount;
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const checkRejectPrAssign = async (id: number, textReason: string) => {
  try {
    // const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, { textReason });
    const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR_ASSIGN}/${id}`, textReason, {
      rawStringBody: true,
    });

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về dữ liệu đã phê duyệt
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi xảy ra
  }
};
export const checkAssignPr = async (id: number, data: IItemInDetailPr[] | []) => {
  try {
    // const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, { textReason });
    const response = await api.post(`${ENDPOINT.HANDLE_ASSIGN_PR}/${id}`, data);

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về dữ liệu đã phê duyệt
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi xảy ra
  }
};
