import { create } from 'zustand';
// Giữ nguyên TypeUser để tương thích với cấu trúc hiện có nếu IUser không phải là cùng một kiểu
import api from '../../../utils/setup-axios';
import { ENDPOINT } from '@/utils/Constans';

// Đảm bảo interface `typeInfo` phản ánh đúng các hàm được triển khai
interface typeInfo {
  totalNotification: number;
  setTotal: (val: number) => void;
  fetData: () => Promise<void>;
}

export const useTotalNotificationNoRead = create<typeInfo>(set => ({
  totalNotification: 0,

  setTotal: (val: number) => {
    set({ totalNotification: val });
  },

  fetData: async () => {
    try {
      const response = await api.get(ENDPOINT.GET_TOTAL_NOTIFICATION_NO_READ);
      if (response.status === 200 && response.data.isSuccess) {
        const userData: number = response.data.data; // Đảm bảo kiểu dữ liệu phù hợp
        if (userData >= 0) {
          set({ totalNotification: userData }); // Cập nhật state với dữ liệu đầy đủ từ API
        }
      } else {
        throw new Error('API trả về lỗi hoặc trạng thái không thành công');
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error); // Log lỗi rõ ràng hơn
    }
  },
}));
