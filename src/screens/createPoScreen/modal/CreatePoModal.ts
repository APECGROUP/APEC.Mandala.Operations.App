import { create } from 'zustand';
// views/modal/CreatePoModal.ts
import { IParams } from '@/screens/approvePrScreen/modal/ApproveModal';
import { AssignPriceFilters, Filter } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';
import { IStausGlobal } from '@/zustand/store/useStatusGlobal/useStatusGlobal';
// Đảm bảo moment được import nếu bạn dùng nó cho Date objects

export interface CreatePoFilters {
  prNo?: string; // Tên cũ là prNo
  prDate?: Date;
  expectedDate?: Date;
  department?: IPickDepartment | undefined;
  requester?: IPickRequester | undefined;
  product?: any;
  ncc?: IItemSupplier;
  status?: IStausGlobal | undefined;
}

export interface IResponseListCreatePo {
  data: IItemCreatePo[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IItemCreatePo {
  prNo: string;
  prDate: Date;
  expectedDate: Date;
  requestBy: string;
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

export const fetchListCreatePo = async (
  page: number,
  limit: number = 50,
  filters: CreatePoFilters,
): Promise<IItemCreatePo> => {
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

    const response = await api.post<IItemCreatePo, any>(ENDPOINT.GET_LIST_CREATE_PO, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCreatePo = async (prNo: string) => {
  try {
    const response = await api.get(`${ENDPOINT.CREATE_PO}/${prNo}`);
  } catch (error) {}
};

export const deleteCreatePo = async (id: string) => {
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
