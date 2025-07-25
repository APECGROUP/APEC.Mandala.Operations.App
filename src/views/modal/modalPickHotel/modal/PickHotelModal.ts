// Trong file PickHotelModal.ts hoặc nơi định nghĩa fetchListHotel

import { ENDPOINT } from '@/utils/Constans';
import api from '@/utils/setup-axios';
// import axios from 'axios';
// import api from '../services/api'; // Hoặc đường dẫn chính xác đến file 'api.ts' của bạn

export interface IResponseListHotel {
  data: IDataListHotel[];
  pagination: null;
  isSuccess: boolean;
  errors: ApiError[]; // Đã đổi tên từ Error thành ApiError để tránh trùng tên
}

export interface IDataListHotel {
  code: string;
  name: string;
}

export interface ApiError {
  id: null;
  code: number;
  message: string;
}

export const fetchListHotel = async (): Promise<IResponseListHotel> => {
  // Khai báo rõ ràng kiểu trả về
  try {
    const res = await api.get<IResponseListHotel>(ENDPOINT.GET_LIST_HOTEL);
    if (res.status !== 200) {
      // Luôn throw lỗi nếu status không phải 200
      throw new Error(`Failed to fetch hotel list: Server responded with status ${res.status}`);
    }
    return res.data;
  } catch (error) {
    // Log lỗi để dễ debug
    console.error('Error in fetchListHotel:', error);
    // Quan trọng: Phải re-throw lỗi ở đây để React Query có thể bắt được
    throw error;
  }
};
