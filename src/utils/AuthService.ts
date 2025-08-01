import axios from 'axios';
import api from './setup-axios';
import { ENDPOINT } from './Constans';
import DataLocal from '@/data/DataLocal';

export interface IResponseRefreshToken {
  data: Data;
  pagination: null;
  isSuccess: boolean;
  errors: null;
}

export interface Data {
  accessToken: string;
  refreshToken: string;
}

// Gọi API refresh token
export const refreshTokenAPI = async (refreshToken: string) => {
  try {
    const response = await api.post<IResponseRefreshToken>(ENDPOINT.REFRESH_TOKEN, {
      accessToken: DataLocal.token?.accessToken,
      refreshToken: DataLocal.token?.refreshToken || refreshToken,
    });
    if (response.status !== 200 || !response.data.isSuccess) {
      throw new Error('Refresh token failed');
    } else if (response.data.isSuccess) {
      return response.data; // { accessToken, refreshToken }
    }
  } catch (error) {
    return null;
  }
};
