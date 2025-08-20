import { Filter, IParams } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IPickLocal } from '@/views/modal/modalPickLocal/modal/PickLocalModal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';
import { IItemStatus } from '@/zustand/store/useStatusGlobal/useStatusGlobal';

export interface PcPrFilters {
  prNo?: string;
  pO?: string;
  requester?: IPickRequester | undefined;
  prDate?: Date;
  expectedDate?: Date;
  department?: IPickDepartment | undefined;
  store?: IPickLocal | undefined;
  status?: IItemStatus | undefined;
}

export interface IItemPcPr {
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
  approveBy: string;
  approveLevel: null;
  approveDate: Date;
  approveRemark: null;
  cancelBy: null;
  cancelDate: null;
  cancelReason: null;
  notAllowBy: null | string;
  notAllowDate: Date | null;
  notAllowReason: null | string;
  marketListId: number | null;
  description: null | string;
  status: string;
  poNo: null | string;
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

export interface IResponseListPCPR {
  data: IItemPcPr[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export const fetchPcPrData = async (
  page: number,
  limit: number = 50,
  filters: PcPrFilters | undefined,
): Promise<{ data: IItemPcPr[]; pagination: Pagination }> => {
  try {
    const filterList: Filter[] = [];

    // if (filters?.prNo) {
    //   filterList.push({
    //     propertyName: 'prNo',
    //     propertyValue: filters.prNo,
    //     propertyType: 'string',
    //     operator: '==',
    //   });
    // }
    if (filters?.pO) {
      filterList.push({
        propertyName: 'poNo',
        propertyValue: filters.pO,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters?.prDate) {
      filterList.push({
        propertyName: 'prDate',
        propertyValue: filters.prDate.toISOString(),
        propertyType: 'datetime',
        operator: '==',
      });
    }
    if (filters?.store?.storeCode) {
      filterList.push({
        propertyName: 'storeCode',
        propertyValue: filters.store.storeCode,
        propertyType: 'string',
        operator: '==',
      });
    }
    if (filters?.status?.status) {
      filterList.push({
        propertyName: 'status',
        propertyValue: filters.status.status,
        propertyType: 'string',
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

    const response = await api.post<IResponseListPCPR>(ENDPOINT.GET_LIST_PC_PR, params);
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
