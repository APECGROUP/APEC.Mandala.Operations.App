import { Filter, IParams } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IPickLocal } from '@/views/modal/modalPickLocal/modal/PickLocalModal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';
import { IStausGlobal } from '@/zustand/store/useStatusGlobal/useStatusGlobal';

// --- (Các interfaces không thay đổi) ---

export interface PcPrFilters {
  prNo?: string;
  pO?: string;
  requester: IPickRequester | undefined;
  prDate?: Date;
  expectedDate?: Date;
  department?: IPickDepartment | undefined;
  store?: IPickLocal | undefined;
  status?: IStausGlobal | undefined;
}

export interface IResponseListPCPR {
  data: IItemPcPr[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IItemPcPr {
  prNo: string;
  prDate: Date;
  expectedDate: Date;
  requestBy: string;
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

export const fetchPcPrData = async (
  page: number,
  limit: number = 50,
  filters: PcPrFilters,
): Promise<IItemPcPr> => {
  try {
    const filterList: Filter[] = [];

    filterList.push({
      propertyValue: 'PC',
      propertyName: 'status',
      propertyType: 'string',
      operator: '==',
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

    const response = await api.post<IItemPcPr, any>(ENDPOINT.GET_LIST_PC_PR, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
