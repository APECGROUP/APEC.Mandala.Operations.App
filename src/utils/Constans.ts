import { s } from 'react-native-size-matters';

export const PaddingHorizontal = s(16);
export enum ENDPOINT {
  LOGIN = '/api/spc/user/login',
  LOGOUT = '/api/spc/user/logout',
  REFRESH_TOKEN = '/api/spc/user/refresh-token',
  FORGOT_PASSWORD = '/api/spc/user/forgot-password',
  GET_LIST_HOTEL = '/api/spc/hotel/list',
  GET_STATUS_GLOBAL = '/api/spc/hotel/list-status',
  GET_LIST_SUPPLIER = '/api/spo/supplier/search',
  GET_LIST_ITEM = '/api/spc/pc-item-list/search',
  GET_LIST_DEPARTMENT = '/api/pms/department/search',
  GET_LIST_LOCATION = '/api/spc/store/search',
}
