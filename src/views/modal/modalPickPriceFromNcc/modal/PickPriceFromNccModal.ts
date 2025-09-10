import {
  IItemVendorPrice,
  IResponseVendorPriceList,
} from '@/screens/createPriceScreen/modal/CreatePriceModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
import moment from 'moment';
export interface IResponseListSupplier {
  data: IItemSupplier[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: Error[] | null;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export interface IItemSupplier {
  code: string;
  accountName: string;
  address1: string;
  address2: string;
  country: string | null;
  phone: string;
  fax: string | null;
  representative: null | string;
  vatCode: null | string;
  balance: number | string;
  type: string;
  creditLimit: null | number;
  invoiceName: string;
  email: null | string;
  term: string | null;
  id: number;
  createdBy?: string;
  createdDate: Date;
  deletedDate: string | null;
  deletedBy: string | null;
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

export interface ResponseNcc {
  id: string | undefined;
  name: string | undefined;
}

interface FilterItem {
  propertyName: string;
  propertyType: string;
  operator: string;
  propertyValue: string;
}

interface FilterGroup {
  filters: FilterItem[];
  condition: 'And' | 'Or';
}

interface MoreFilterGroup {
  groupFilters: FilterGroup[];
  condition: 'And' | 'Or';
}

interface Params {
  pagination: {
    pageIndex: number;
    pageSize: number;
    isAll: boolean;
  };
  filter: {
    textSearch: string;
    filterGroup: FilterGroup[];
    moreFilterGroup: MoreFilterGroup;
  };
}

export const fetchNccData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IItemSupplier> => {
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
    const response = await api.post<IResponseListSupplier, any>(ENDPOINT.GET_LIST_SUPPLIER, params);
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const fetchPickPriceFromNcc = async (
  page: number,
  limit: number = 50,
  searchKey: string,
  itemCode: string,
  timeSystem: string,
  requestDate: string,
): Promise<IItemVendorPrice[]> => {
  try {
    const fomatRequestDate = requestDate ? moment(requestDate).format('YYYY-MM-DD') : '';
    const fomatTimeSystem = timeSystem ? moment(timeSystem, 'DD/MM/YYYY').format('YYYY-MM-DD') : '';

    const filters: FilterItem[] = [
      {
        propertyName: 'itemCode',
        propertyType: 'string',
        operator: '==',
        propertyValue: itemCode,
      },
      {
        propertyName: 'status',
        propertyType: 'string',
        operator: '==',
        propertyValue: 'A',
      },
    ];

    if (fomatTimeSystem) {
      filters.push({
        propertyName: 'validFrom',
        propertyType: 'date',
        operator: '<=',
        propertyValue: fomatTimeSystem,
      });
    }

    if (fomatRequestDate) {
      filters.push({
        propertyName: 'validFrom',
        propertyType: 'date',
        operator: '<=',
        propertyValue: fomatRequestDate,
      });
    }

    const validToFilters: FilterItem[] = [
      {
        propertyName: 'validTo',
        propertyType: 'date',
        operator: '==',
        propertyValue: '',
      },
    ];

    if (fomatRequestDate) {
      validToFilters.push({
        propertyName: 'validTo',
        propertyType: 'date',
        operator: '>',
        propertyValue: fomatRequestDate,
      });
    }

    const moreFilterGroup: MoreFilterGroup = {
      groupFilters: [
        {
          filters: validToFilters,
          condition: 'Or',
        },
      ],
      condition: 'And',
    };

    const params: Params = {
      pagination: {
        pageIndex: page,
        pageSize: limit,
        isAll: false,
      },
      filter: {
        textSearch: searchKey?.trim(),
        filterGroup: [
          {
            filters: filters,
            condition: 'And',
          },
        ],
        moreFilterGroup: moreFilterGroup,
      },
    };

    const response = await api.post<IResponseVendorPriceList>(
      ENDPOINT.GET_LIST_VENDOR_PRICE,
      params,
    );

    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Failed to fetch data');
    }

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
