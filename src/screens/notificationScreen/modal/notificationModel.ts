// models/notificationModel.ts

import { IApprove, IParams } from '@/screens/approvePrScreen/modal/ApproveModal';
import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';

export interface IResponseNotification {
  data: IItemNotification[];
  pagination: Pagination;
  isSuccess: boolean;
  errors: null;
}

export interface IItemNotification {
  prId: number;
  prNo: string;
  status: string;
  message: string;
  title: string;
  isRead: boolean;
  request: IApprove;
  readAt: null;
  userId: number;
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

export const fetchNotificationData = async (
  page: number,
  limit: number = 50,
): Promise<{ data: IItemNotification[]; pagination: Pagination }> => {
  try {
    const params: IParams = {
      pagination: {
        pageIndex: page,
        pageSize: limit,
        isAll: false,
      },
    };

    const response = await api.post<IResponseNotification>(ENDPOINT.GET_LIST_NOTIFICATION, params);
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

export const checkReadNotification = async (id: number) => {
  try {
    const response = await api.patch(`${ENDPOINT.HANDLE_READ_NOTIFICATION}/${id}`);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '', isEdit: response.data.data.isEdit };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message, isEdit: true };
    }
  } catch (error) {
    return {
      isSuccess: false,
      message: 'An error occurred while approving PR without changes.',
      isEdit: true,
    };
  }
};

export const checkReadAllNotification = async () => {
  try {
    const response = await api.patch(`${ENDPOINT.HANDLE_READ_ALL_NOTIFICATION}`);
    if (response.status === 200 && response.data.isSuccess) {
      return { isSuccess: true, message: '' };
    } else {
      return { isSuccess: false, message: response.data.errors[0].message };
    }
  } catch (error) {
    return { isSuccess: false, message: 'An error occurred while approving PR without changes.' };
  }
};
