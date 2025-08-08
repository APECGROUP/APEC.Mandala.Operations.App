import {
  AssignPriceFilters,
  Filter,
  IParams,
} from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';

export interface IResponsePRDetail {
  data: IItemInDetailPr[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IItemInDetailPr {
  prId: number;
  prNo: string;
  itemUnit: string;
  unitName: string;
  quantity: number;
  remark: null;
  price: number;
  vendor: string;
  vendorName: string;
  approvedQuantity: number;
  status: string;
  vat: string;
  itemCode: string;
  iName: string;
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

export const fetchInformationItemsData = async (
  page: number,
  limit: number = 50,
  prNo: string,
  filters?: AssignPriceFilters,
): Promise<IItemInDetailPr> => {
  try {
    const filterList: Filter[] = [];
    filterList.push({
      propertyValue: prNo,
      propertyName: 'prNo',
      propertyType: 'string',
      operator: '==',
    });
    if (filters?.prDate) {
      filterList.push({
        propertyName: 'prDate',
        propertyValue: filters.prDate.toISOString(),
        propertyType: 'datetime',
        operator: '==',
      });
    }

    if (filters?.expectedDate) {
      filterList.push({
        propertyName: 'expectedDate',
        propertyValue: filters.expectedDate.toISOString(),
        propertyType: 'datetime',
        operator: '==',
      });
    }

    if (filters?.department?.departmentCode) {
      filterList.push({
        propertyName: 'departmentCode',
        propertyValue: filters.department.departmentCode,
        propertyType: 'string',
        operator: '==',
      });
    }

    if (filters?.requester?.id) {
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

    const response = await api.post<IItemInDetailPr, any>(ENDPOINT.DETAIL_PR, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSavedraft = async (id: number, data: IItemInDetailPr[]) => {
  try {
    const response = await api.put(ENDPOINT.SAVE_DRAFT, data);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' }; // Trả về false nếu có lỗi
    } else {
      return { isSuccess: false, message: response.data.errors[0].message }; // Trả về true nếu lưu nháp thành công
    }
  } catch (error) {
    return { isSuccess: false, message: '' }; // Trả về false nếu có lỗi
  }
};
