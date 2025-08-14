// views/modal/CreatePriceModal.ts

import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { Filter, IParams } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';

// --- Interfaces đã sửa và định nghĩa lại ---

export interface IResponseListVat {
  data: IItemVat[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface IItemVat {
  code: string;
  name: string;
  rate: number;
  id: number;
  createdBy: string;
  createdDate: Date;
  deletedDate: null;
  deletedBy: null;
  deleted: string;
}

export interface CreatePriceFilters {
  prNo?: string;
  ncc?: IItemSupplier;
  status?: { code: string; id: number | string; name: string };
  product?: IPickItem;
}

export interface IItemNewCreatePrice {
  vendorCode: string;
  itemCode: string;
  validFrom: Date;
  validTo: Date;
  price: number;
  vatCode: string;
}

export interface IItemVendorPrice {
  vatId: number | string;
  vendorCode: string;
  vendorName: string;
  itemCode: string | number;
  itemName: string;
  unitCode: number;
  unitName: string;
  validFrom: Date;
  validTo: Date;
  price: number;
  notes: null;
  vatCode: string;
  status: string;
  approvedBy: string;
  approvedDate: Date;
  id: number;
  createdBy: null | string;
  createdDate: Date;
  deletedDate: null;
  deletedBy: null;
  deleted: string;
}

// Đây là interface chuẩn cho response API
export interface IResponseVendorPriceList {
  data: IItemVendorPrice[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface Pagination {
  pageCurrent: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  firstRowOnPage: number;
  lastRowOnPage: number;
}

// --- Hàm fetchCreatePrice đã sửa ---

export const fetchCreatePrice = async (
  page: number,
  limit: number = 50,
  filters: CreatePriceFilters | undefined = undefined,
): Promise<{ data: IItemVendorPrice[]; pagination: Pagination }> => {
  try {
    const filterList: Filter[] = [];

    if (filters?.status) {
      filterList.push({
        propertyName: 'status',
        propertyValue: filters?.status.code,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters?.ncc) {
      filterList.push({
        propertyName: 'vendorCode',
        propertyValue: filters?.ncc.code,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters?.product) {
      filterList.push({
        propertyName: 'itemCode',
        propertyValue: filters?.product.iCode,
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

    // Dùng đúng interface cho response từ API
    const response = await api.post<IResponseVendorPriceList>(
      ENDPOINT.GET_LIST_VENDOR_PRICE,
      params,
    );

    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }

    // Trả về một object chứa cả data và pagination
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    throw error;
  }
};

// --- Các hàm xử lý khác không cần sửa ---

export const checkRejectCreatePrice = async (listSelect: number[]) => {
  try {
    const response = await api.put(`${ENDPOINT.HANDLE_REJECT_CREATE_PRICE}`, listSelect);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' };
  }
};

export const checkApproveCreatePrice = async (listSelect: number[]) => {
  try {
    const response = await api.put(`${ENDPOINT.HANDLE_APPROVE_CREATE_PRICE}`, listSelect);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' };
  }
};

export const checkCreatePrice = async (listSelect: IItemVendorPrice[]) => {
  try {
    const response = await api.post(`${ENDPOINT.CREATE_PRICE}`, listSelect);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' };
  }
};

export const checkDeleteCreatePrice = async (id: number) => {
  try {
    const response = await api.delete(`${ENDPOINT.HANDLE_DELETE_CREATE_PRICE}/${id}`);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' };
  }
};

export const deleteCreatePrice = async (id: string) => {
  try {
    return id;
  } catch (error) {
    console.error('Error deleting item on backend:', error);
    return false;
  }
};
