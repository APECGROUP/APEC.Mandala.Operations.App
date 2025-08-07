import axios from 'axios';
import DataLocal from '../data/DataLocal';
// Import refreshTokenAPI từ file AuthService riêng biệt
import { refreshTokenAPI } from './AuthService';

import { BASE_URL } from '../env';
import Toast from 'react-native-toast-message';
import { DeviceEventEmitter } from 'react-native';

// Khởi tạo instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

// Lưu trữ transformRequest mặc định của Axios
// Điều này cần thiết để có thể khôi phục lại transformRequest mặc định
const defaultTransformRequest = axios.defaults.transformRequest;

// Mở rộng AxiosRequestConfig để thêm các thuộc tính tùy chỉnh
declare module 'axios' {
  export interface AxiosRequestConfig {
    noAuth?: boolean;
    _retry?: boolean; // Đánh dấu request đã thử lại hay chưa
    rawStringBody?: boolean; // Thuộc tính mới: nếu true, gửi body là chuỗi nguyên bản
  }
}

// 🛡️ Biến kiểm soát trạng thái đang refresh token (để tránh gọi nhiều lần cùng lúc)
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
  refreshSubscribers = []; // Xóa hàng đợi sau khi gọi xong
};

// ✅ Interceptor trước khi gửi request
api.interceptors.request.use(
  async config => {
    // Lấy token hiện tại từ DataLocal (đã được cập nhật để xử lý expiresAt/refreshExpiresAt)
    await DataLocal.getToken();

    // 🛑 THÊM LOGIC KIỂM TRA hotelCode TẠI ĐÂY
    // Nếu không có hotelCode trong DataLocal.user và request không phải là noAuth,
    // thì dừng request và trả về lỗi.
    if (!DataLocal?.user?.hotelCode && !config?.noAuth) {
      Toast.show({
        type: 'error',
        text2: 'Mã khách sạn không tồn tại. Yêu cầu API bị hủy bỏ.',
      });
      return Promise.reject(new Error('Hotel code is missing. API call aborted.'));
    }

    // Nếu request không yêu cầu xác thực, bỏ qua
    if (config?.noAuth) {
      // Đảm bảo transformRequest được đặt lại mặc định nếu không có rawStringBody
      config.transformRequest = config.rawStringBody
        ? [
            data => {
              const stringData = String(data);
              const escapedString = stringData.replace(/"/g, '\\"');
              return `"${escapedString}"`;
            },
          ]
        : defaultTransformRequest;
      return config;
    }

    // Nếu có accessToken, thêm vào header Authorization
    if (DataLocal.token?.accessToken) {
      config.headers.Authorization = `Bearer ${DataLocal.token.accessToken}`;
    }
    // Thêm hotelCode vào header từ DataLocal.user
    if (DataLocal.user?.hotelCode) {
      config.headers.hotelCode = DataLocal.user?.hotelCode;
    }

    // --- Logic mới để xử lý rawStringBody ---
    if (config.rawStringBody) {
      // Đặt Content-Type mặc định là text/plain cho raw string bodies
      // Nếu người dùng muốn gửi chuỗi JSON nhưng với rawStringBody: true,
      // họ có thể ghi đè Content-Type thành 'application/json' trong headers config.
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'text/plain';

      // Đảm bảo dữ liệu được chuyển đổi thành chuỗi, các dấu ngoặc kép bên trong được thoát,
      // và toàn bộ chuỗi được bao bọc bởi dấu ngoặc kép.
      config.transformRequest = [
        data => {
          const stringData = String(data);
          // Thoát các dấu ngoặc kép bên trong chuỗi
          const escapedString = stringData.replace(/"/g, '\\"');
          // Bao bọc toàn bộ chuỗi bằng dấu ngoặc kép
          return `"${escapedString}"`;
        },
      ];
    } else {
      // Đặt lại transformRequest về mặc định nếu rawStringBody không được đặt hoặc là false
      config.transformRequest = defaultTransformRequest;
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

    // 📛 Nếu lỗi là 401 (Unauthorized - token hết hạn hoặc không hợp lệ) và request chưa được thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request này đã được thử lại

      // Lấy lại token từ DataLocal để kiểm tra refresh token
      await DataLocal.getToken();
      // 🚫 Nếu không có refresh token → đăng xuất người dùng
      if (!DataLocal.token?.refreshToken) {
        Toast.show({ type: 'error', text2: 'Không có refresh token, vui lòng đăng nhập lại.' });
        DataLocal.removeAll(); // Xóa tất cả dữ liệu và đăng xuất
        DeviceEventEmitter.emit('logout'); // Gửi sự kiện đăng xuất
        return Promise.reject(error);
      }

      // Nếu chưa có quá trình refresh nào đang diễn ra
      if (!isRefreshing) {
        isRefreshing = true; // Đặt trạng thái đang refresh
        console.log('--- Kích hoạt quá trình làm mới token ---');
        try {
          // 🔃 Gọi API để làm mới token
          // Đảm bảo refreshTokenAPI không sử dụng instance 'api' này để tránh vòng lặp
          const newToken = await refreshTokenAPI(DataLocal.token.refreshToken);
          if (!newToken) {
            // Kiểm tra trực tiếp newToken, không cần .data nữa
            throw new Error('Refresh token thất bại: Không nhận được token mới.');
          }

          // 💾 Lưu token mới vào DataLocal.
          // CHÚ Ý: Truyền expiresAt và refreshExpiresAt trực tiếp từ phản hồi API
          await DataLocal.saveToken(
            newToken.accessToken, // Sử dụng accessToken từ phản hồi API
            newToken.refreshToken, // Sử dụng refreshToken từ phản hồi API
            newToken.expiresAt, // Sử dụng expiresAt từ phản hồi API
            newToken.refreshExpiresAt, // Sử dụng refreshExpiresAt từ phản hồi API
          );

          Toast.show({ type: 'success', text2: 'Làm mới token thành công!' });

          isRefreshing = false;
          // 🔁 Gọi lại tất cả các request đang chờ với accessToken mới
          onTokenRefreshed(newToken.accessToken);

          // 📌 Gửi lại request ban đầu với accessToken mới
          originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
          // Đảm bảo hotelCode cũng được cập nhật cho request ban đầu đang được retry
          if (DataLocal.user?.hotelCode) {
            originalRequest.headers.hotelCode = DataLocal.user?.hotelCode;
          } else {
            // Nếu hotelCode không còn, có thể cần hủy request hoặc xử lý khác
            // Tùy thuộc vào yêu cầu của ứng dụng, có thể reject hoặc bỏ qua hotelCode
            console.warn('Hotel code missing during retry, request might fail.');
          }
          // Đảm bảo transformRequest của originalRequest cũng được xử lý lại
          originalRequest.transformRequest = originalRequest.rawStringBody
            ? [
                data => {
                  const stringData = String(data);
                  const escapedString = stringData.replace(/"/g, '\\"');
                  return `"${escapedString}"`;
                },
              ]
            : defaultTransformRequest;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.error(
            'Lỗi khi làm mới token trong interceptor:',
            refreshError.response?.data || refreshError.message,
          ); // Log lỗi chi tiết
          Toast.show({
            type: 'error',
            text2: 'Refresh token thất bại, đang đăng xuất...',
          });
          DataLocal.removeAll(); // Đăng xuất nếu refresh token thất bại
          DeviceEventEmitter.emit('logout'); // Gửi sự kiện đăng xuất
          return Promise.reject(refreshError);
        }
      }

      // ⏸️ Nếu đang có quá trình refresh token đang diễn ra → thêm request vào hàng đợi
      return new Promise(resolve => {
        addSubscriber((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Đảm bảo hotelCode cũng được cập nhật cho request đang chờ
          if (DataLocal.user?.hotelCode) {
            originalRequest.headers.hotelCode = DataLocal.user?.hotelCode;
          } else {
            // Tương tự, nếu hotelCode không còn, xử lý tùy theo yêu cầu
            console.warn('Hotel code missing for pending request, request might fail.');
          }
          // Đảm bảo transformRequest của originalRequest cũng được xử lý lại
          originalRequest.transformRequest = originalRequest.rawStringBody
            ? [
                data => {
                  const stringData = String(data);
                  const escapedString = stringData.replace(/"/g, '\\"');
                  return `"${escapedString}"`;
                },
              ]
            : defaultTransformRequest;
          resolve(api(originalRequest)); // Gọi lại request sau khi có token mới
        });
      });
    }

    // ❌ Xử lý lỗi mạng
    if (error.message === 'Network Error') {
      DeviceEventEmitter.emit('showToast', {
        type: 'error',
        text: 'Kết nối mạng không ổn định!',
      });
      return Promise.reject({
        message: 'Kết nối mạng không ổn định!',
        status: 0,
        type: 'server',
        error: true,
      });
    }

    // Trả về lỗi cho các trường hợp khác
    return Promise.reject(error);
  },
);

export default api;
