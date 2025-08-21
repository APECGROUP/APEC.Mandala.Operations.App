import { IParams } from '@/screens/approvePrScreen/modal/ApproveModal';
import { Filter } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';

export interface CreatePoFilters {
  prNo?: string;
  prDate?: Date;
  expectedDate?: Date;
  department?: IPickDepartment | undefined;
  requester?: IPickRequester | undefined;
}

export interface IResponseListCreatePo {
  data: IItemCreatePo[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export interface IItemCreatePo {
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

export const fetchListCreatePo = async (
  page: number,
  limit: number = 50,
  filters: CreatePoFilters | undefined,
): Promise<{ data: IItemCreatePo[]; pagination: Pagination }> => {
  try {
    const filterList: Filter[] = [];
    filterList.push({
      propertyName: 'status',
      propertyValue: 'PO',
      propertyType: 'string',
      operator: '==',
    });
    // if (filters?.prNo) {
    //   filterList.push({
    //     propertyName: 'prNo',
    //     propertyValue: filters?.prNo.trim(),
    //     propertyType: 'string',
    //     operator: '==',
    //   });
    // }
    if (filters?.prDate) {
      filterList.push({
        propertyName: 'createdDate',
        propertyValue: filters?.prDate.toISOString(),
        propertyType: 'date',
        operator: '>=',
      });
    }
    if (filters?.expectedDate) {
      filterList.push({
        propertyName: 'expectedDate',
        propertyValue: filters?.expectedDate.toISOString(),
        propertyType: 'date',
        operator: '<=',
      });
    }
    if (filters?.department?.departmentCode) {
      filterList.push({
        propertyName: 'departmentCode',
        propertyValue: filters?.department.departmentCode,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters?.requester?.id) {
      filterList.push({
        propertyName: 'requestBy',
        propertyValue: filters?.requester.username,
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

    const response = await api.post<IResponseListCreatePo>(ENDPOINT.GET_LIST_CREATE_PO, params);
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

export const fetchCreatePo = async (prNo: string) => {
  try {
    const params = { prNo: prNo };
    const response = await api.post(`${ENDPOINT.CREATE_PO}`, prNo);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: '' };
  }
};

export const deleteCreatePo = async (id: string) => {
  try {
    return id;
  } catch (error) {
    console.error('Error deleting item on backend:', error);
    return false;
  }
};
