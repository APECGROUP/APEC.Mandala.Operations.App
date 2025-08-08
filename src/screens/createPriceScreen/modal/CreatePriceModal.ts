// views/modal/CreatePriceModal.ts

import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { Filter, IParams } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
// Đảm bảo moment được import nếu bạn dùng nó cho Date objects

export interface IResponseListVat {
  data: IItemVat[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
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
  prNo?: string; // Tên cũ là prNo
  ncc?: IItemSupplier;
  status?: { code: string; id: number; name: string };
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
export interface IResponseVendorList {
  data: IItemVendorPrice[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
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

export interface Pagination {
  pageCurrent: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  firstRowOnPage: number;
  lastRowOnPage: number;
}

export const fetchCreatePrice = async (
  page: number,
  limit: number = 50,
  filters: CreatePriceFilters,
): Promise<IItemSupplier> => {
  try {
    const filterList: Filter[] = [];
    console.log('filter: ', filters);
    // if (filters.prNo) {
    //   filterList.push({
    //     propertyName: 'prNo',
    //     propertyValue: filters.prNo,
    //     propertyType: 'string',
    //     operator: '==',
    //   });
    // }
    if (filters.status) {
      filterList.push({
        propertyName: 'status',
        propertyValue: filters.status.code,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters.ncc) {
      filterList.push({
        propertyName: 'vendorCode',
        propertyValue: filters.ncc.code,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters.product) {
      filterList.push({
        propertyName: 'itemCode',
        propertyValue: filters.product.iCode,
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

    const response = await api.post<IItemVendorPrice, any>(ENDPOINT.GET_LIST_VENDOR_PRICE, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const checkRejectCreatePrice = async (listSelect: number[]) => {
  try {
    // const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, { textReason });
    const response = await api.put(`${ENDPOINT.HANDLE_REJECT_CREATE_PRICE}`, listSelect);

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về dữ liệu đã phê duyệt
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi xảy ra
  }
};
export const checkApproveCreatePrice = async (listSelect: number[]) => {
  try {
    // const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, { textReason });
    const response = await api.put(`${ENDPOINT.HANDLE_APPROVE_CREATE_PRICE}`, listSelect);

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về dữ liệu đã phê duyệt
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi xảy ra
  }
};
export const checkCreatePrice = async (listSelect: IItemVendorPrice[]) => {
  try {
    // const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, { textReason });
    const response = await api.post(`${ENDPOINT.CREATE_PRICE}`, listSelect);

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về dữ liệu đã phê duyệt
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi xảy ra
  }
};
export const checkDeleteCreatePrice = async (id: number) => {
  try {
    // const response = await api.post(`${ENDPOINT.HANDLE_REJECT_PR}/${id}`, { textReason });
    const response = await api.delete(`${ENDPOINT.HANDLE_DELETE_CREATE_PRICE}/${id}`);

    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về dữ liệu đã phê duyệt
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi xảy ra
  }
};
export const deleteCreatePrice = async (id: string) => {
  try {
    // Luôn trả về true để demo UI update, trong thực tế sẽ gọi API delete
    return id;
    // const response = await axios.delete(`/create-price/${id}`);
    // if (response.status === 200) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.error('Error deleting item on backend:', error);
    return false;
  }
};
