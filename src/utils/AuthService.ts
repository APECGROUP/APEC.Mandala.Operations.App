import axios from 'axios'; // Import axios trực tiếp để tạo instance mới
// import api from './setup-axios'; // ❌ Không import 'api' ở đây để tránh vòng lặp
import { ENDPOINT } from './Constans'; // Đảm bảo đường dẫn đúng
import DataLocal from '@/data/DataLocal';
import { BASE_URL } from '@/env';

// Định nghĩa kiểu dữ liệu cho phản hồi refresh token
export interface IRefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // Chuỗi ISO 8601
  refreshExpiresAt: string; // Chuỗi ISO 8601
  hotelCode?: string; // Có thể có hotelCode nếu API trả về
}

// Định nghĩa kiểu dữ liệu cho toàn bộ phản hồi API
export interface IResponseRefreshToken {
  data: IRefreshTokenResponseData;
  pagination: null;
  isSuccess: boolean;
  errors: null;
}

// Tạo một instance Axios riêng biệt chỉ dành cho việc refresh token
// Instance này sẽ không có các interceptor xử lý lỗi 401 của 'api' chính
const refreshApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

/**
 * @function refreshTokenAPI
 * @description Gọi API để làm mới Access Token bằng Refresh Token.
 * @param {string} refreshToken - Refresh Token hiện tại.
 * @returns {Promise<IRefreshTokenResponseData | null>} Dữ liệu token mới hoặc null nếu thất bại.
 */
export const refreshTokenAPI = async (
  refreshToken: string,
): Promise<IRefreshTokenResponseData | null> => {
  try {
    console.log('Calling refreshTokenAPI with:', refreshToken); // Log để kiểm tra

    // Lấy hotelCode từ DataLocal để gửi kèm trong header của refresh token request
    // Giả định DataLocal.token đã được cập nhật với hotelCode sau khi đăng nhập
    await DataLocal.getToken(); // Đảm bảo DataLocal đã được load
    const hotelCode = DataLocal.user?.hotelCode || '';
    if (!hotelCode) {
      console.error('Hotel code is missing in DataLocal.user');
      return null; // Trả về null nếu không có hotelCode
    }

    const response = await refreshApiClient.post<IResponseRefreshToken>(
      ENDPOINT.REFRESH_TOKEN,
      {
        accessToken: DataLocal.token?.accessToken,
        refreshToken: refreshToken,
      },
      {
        headers: {
          hotelcode: hotelCode, // Thêm hotelCode vào header cho refresh token API
        },
      },
    );

    if (response.status === 200 && response.data.isSuccess && response.data.data) {
      return response.data.data; // Trả về đối tượng data chứa thông tin token
    } else {
      console.error('refreshTokenAPI failed with response:', response.data);
      // Quan trọng: Không ném lỗi 401 ở đây để tránh vòng lặp.
      // Chỉ trả về null hoặc một giá trị báo hiệu thất bại.
      return null;
    }
  } catch (error) {
    console.error('Refresh token API error:', error.response?.data || error.message);
    return null;
  }
};

// Các hàm xác thực khác có thể ở đây
// export const loginAPI = async (credentials) => { ... };
