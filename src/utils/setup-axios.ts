import axios from 'axios';
import DataLocal from '../data/DataLocal';
import {refreshTokenAPI} from './AuthService';
import {BASE_URL} from '../env';
import Toast from 'react-native-toast-message';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

declare module 'axios' {
  export interface AxiosRequestConfig {
    noAuth?: boolean;
    _retry?: boolean; // Đánh dấu request đã thử lại hay chưa
  }
}

// 🛡️ Biến kiểm soát trạng thái đang refresh
let isRefreshing = false;

// 🧠 Hàng đợi các request đang bị tạm giữ chờ token mới
let refreshSubscribers: ((token: string) => void)[] = [];

// ✅ Hàm thêm request vào hàng đợi
const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// ✅ Hàm gọi lại tất cả các request đã bị giữ lại với token mới
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = []; // Clear hàng đợi sau khi gọi xong
};

// ✅ Interceptor trước khi gửi request
api.interceptors.request.use(
  async config => {
    await DataLocal.getToken(); // Lấy token hiện tại từ storage

    if (config?.noAuth) {
      return config; // Bỏ qua nếu request không cần auth
    }

    if (DataLocal.token?.accessToken) {
      config.headers.Authorization = `Bearer ${DataLocal.token.accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

// ✅ Interceptor khi nhận response
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 📛 Nếu lỗi là 401 (token hết hạn) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request này đã retry

      // 🚫 Nếu không có refresh token → đăng xuất
      await DataLocal.getToken();
      if (!DataLocal.token?.refreshToken) {
        Toast.show({type: 'error', text2: 'Không có refresh token'});
        DataLocal.removeAll(); // Đăng xuất
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        // 🔃 Chỉ gọi refresh token 1 lần
        isRefreshing = true;

        try {
          const newToken = await refreshTokenAPI(DataLocal.token.refreshToken);
          if (!newToken) {
            throw new Error('Refresh token thất bại');
          }

          // 💾 Lưu token mới
          await DataLocal.saveToken(
            newToken.accessToken,
            newToken.refreshToken,
            newToken.expiresIn,
            newToken.refreshExpiresIn,
          );

          Toast.show({type: 'success', text2: 'Làm mới token thành công'});

          isRefreshing = false;
          onTokenRefreshed(newToken.accessToken); // 🔁 Gọi lại các request đã đợi

          // 📌 Gửi lại request hiện tại với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          Toast.show({
            type: 'error',
            text2: 'Refresh token thất bại, đăng xuất...',
          });
          DataLocal.removeAll();
          return Promise.reject(refreshError);
        }
      }

      // ⏸️ Nếu đang refresh → chờ token mới rồi gọi lại request sau
      return new Promise(resolve => {
        addSubscriber((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest)); // Gọi lại request sau khi có token mới
        });
      });
    }

    // ❌ Lỗi mạng
    if (error.message === 'Network Error') {
      return Promise.reject({
        message: 'Kết nối mạng không ổn định!',
        status: 0,
        type: 'server',
        error: true,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
