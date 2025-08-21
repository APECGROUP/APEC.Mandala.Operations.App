import { Filter, IParams } from '@/screens/approvePrScreen/modal/ApproveModal';
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
): Promise<IItemVendorPrice[]> => {
  try {
    const filterList: Filter[] = [];

    filterList.push({
      propertyName: 'status',
      propertyValue: 'A',
      propertyType: 'string',
      operator: '==',
    });
    filterList.push({
      propertyName: 'itemCode',
      propertyValue: itemCode,
      propertyType: 'string',
      operator: '==',
    });
    filterList.push({
      propertyName: 'validTo',
      propertyValue: moment().format('YYYY-MM-DD'),
      propertyType: 'string',
      operator: '>=',
    });
    filterList.push({
      propertyName: 'validFrom',
      propertyValue: moment().format('YYYY-MM-DD'),
      propertyType: 'string',
      operator: '<=',
    });

    const params: IParams = {
      pagination: {
        pageIndex: page,
        pageSize: limit,
        isAll: false,
      },
      filter: {
        textSearch: searchKey?.trim(),
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
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
