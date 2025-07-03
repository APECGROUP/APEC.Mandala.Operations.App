// views/modal/CreatePriceModal.ts

import axios from 'axios';
import moment from 'moment'; // Đảm bảo moment được import nếu bạn dùng nó cho Date objects

export interface TypeCreatePrice {
  id: string;
  name: string;
  price: string;
  expanded?: boolean;
  time?: string;
  vat?: string;
  ncc?: string;
  end?: string;
  createdAt?: string; // Giả sử là ISO string hoặc Date object
  estimateDate?: string; // Giả sử là ISO string hoặc Date object
}

export interface SelectedOption {
  id: string;
  name: string;
}

export interface CreatePriceFilters {
  searchKey?: string; // Tên cũ là prNo
  fromDate?: Date;
  toDate?: Date;
  department?: SelectedOption;
  requester?: SelectedOption;
}

// Cache để tránh gọi API trùng lặp (GIỮ NGUYÊN THEO YÊU CẦU CỦA BẠN)
const cache = new Map<string, TypeCreatePrice[]>();

/**
 * Hàm giả lập để tạo dữ liệu TypeCreatePrice.
 * Logic tạo dữ liệu ngẫu nhiên được tách ra để dễ quản lý.
 */
function generateMockCreatePriceData(item: any, filters: CreatePriceFilters): TypeCreatePrice {
  const numberOfImages = Math.floor(Math.random() * 10) + 1;
  // Lưu ý: Picsum Photos không hỗ trợ lọc, nên bạn vẫn sẽ nhận ảnh ngẫu nhiên.
  // Đây là phần bạn sẽ thay thế bằng logic mapping từ API thật.
  const imageUrls = Array.from(
    { length: numberOfImages },
    (_, i) => `https://picsum.photos/id/${item.id + i}/300/300`,
  );

  let contentName = [
    'Táo đỏ phơi khô',
    'Thịt gà Đông Tảo',
    'Thịt cừu Mỹ',
    'Thịt lợn Bắc Ninh',
    'Thịt châu Đông Anh',
    'Thịt bò Mỹ Đình',
  ][Math.floor(Math.random() * 6)];

  // Nếu có searchKey, giả lập rằng tên sản phẩm được lọc theo searchKey
  // (mặc dù API picsum không thực sự lọc)
  if (filters.searchKey && !contentName.toLowerCase().includes(filters.searchKey.toLowerCase())) {
    contentName = `${filters.searchKey} - ${contentName}`; // Đảm bảo searchKey xuất hiện trong tên
  }

  // Giả lập dữ liệu phòng ban và người yêu cầu
  const mockDepartments = [
    { id: 'dep1', name: 'Phòng Kế toán' },
    { id: 'dep2', name: 'Phòng IT' },
    { id: 'dep3', name: 'Phòng Kinh doanh' },
    { id: 'dep4', name: 'Phòng Nhân sự' },
    { id: 'dep5', name: 'Phòng Sản xuất' },
  ];
  const mockRequesters = [
    { id: 'req1', name: 'Nguyễn Văn A' },
    { id: 'req2', name: 'Trần Thị B' },
    { id: 'req3', name: 'Lê Văn C' },
    { id: 'req4', name: 'Phạm Thị D' },
    { id: 'req5', name: 'Hoàng Văn E' },
  ];

  // Giả lập việc department/requester khớp với filter nếu có
  let randomDepartment = mockDepartments[Math.floor(Math.random() * mockDepartments.length)];
  if (filters.department?.id && !mockDepartments.some(d => d.id === filters.department?.id)) {
    // Nếu filter có department nhưng mock ngẫu nhiên không khớp, chọn department theo filter
    randomDepartment = filters.department;
  }

  let randomRequester = mockRequesters[Math.floor(Math.random() * mockRequesters.length)];
  if (filters.requester?.id && !mockRequesters.some(r => r.id === filters.requester?.id)) {
    // Nếu filter có requester nhưng mock ngẫu nhiên không khớp, chọn requester theo filter
    randomRequester = filters.requester;
  }

  // Giả lập ngày tháng khớp với filter nếu có
  const createdAt = filters.fromDate ? filters.fromDate.toISOString() : new Date().toISOString();
  const estimateDate = filters.toDate ? filters.toDate.toISOString() : new Date().toISOString();

  return {
    id: item.id,
    name: contentName,
    price: (Math.floor(Math.random() * 100) + 1) * 1000, // Giá ngẫu nhiên
    expanded: false,
    time: '28/05/2025 - 30/05/2025', // Giả lập
    createdAt: createdAt,
    estimateDate: estimateDate,
    vat: 'V8',
    ncc: 'Công Ty TNHH XNK Thuận Phát', // Giả lập
    end: 'Chai', // Giả lập
    department: randomDepartment,
    requester: randomRequester,
  };
}

/**
 * Tạo cache key duy nhất dựa trên tất cả các tham số ảnh hưởng đến kết quả.
 * (GIỮ NGUYÊN THEO YÊU CẦU CỦA BẠN)
 */
function getCacheKey(page: number, limit: number, filters: CreatePriceFilters): string {
  const { searchKey, fromDate, toDate, department, requester } = filters;
  return `${page}_${limit}_${searchKey || ''}_${fromDate?.toISOString() || ''}_${
    toDate?.toISOString() || ''
  }_${department?.id || ''}_${requester?.id || ''}`;
}

/**
 * Lấy danh sách TypeCreatePrice từ API (giả lập) và áp dụng bộ lọc.
 *
 * @param page Số trang cần lấy.
 * @param limit Số lượng item trên mỗi trang.
 * @param filters Đối tượng chứa tất cả các điều kiện lọc.
 * @returns Promise chứa mảng TypeCreatePrice.
 */
export const fetchCreatePrice = async (
  page: number,
  limit: number = 50,
  filters: CreatePriceFilters = {},
): Promise<TypeCreatePrice[]> => {
  const cacheKey = getCacheKey(page, limit, filters);

  // Kiểm tra cache trước để tăng hiệu năng (GIỮ NGUYÊN THEO YÊU CẦU CỦA BẠN)
  if (cache.has(cacheKey)) {
    console.log(
      '--- fetchCreatePrice: Returning data from internal cache for key:',
      cacheKey,
      '---',
    );
    return cache.get(cacheKey)!;
  }

  try {
    // Giả lập độ trễ mạng để mô phỏng gọi API thực tế
    await new Promise<void>(resolve => setTimeout(resolve, 800));

    // --- Endpoint API thật của bạn ---
    // THAY THẾ DÒNG NÀY BẰNG ENDPOINT API THẬT CỦA BẠN.
    // Ví dụ: const apiUrl = `https://your-api.com/create-prices`;
    const apiUrl = `https://picsum.photos/v2/list`;

    // --- Chuẩn bị các tham số cho yêu cầu API ---
    // Các tham số 'page' và 'limit' sẽ luôn được gửi.
    // Các tham số lọc khác (filters) sẽ được thêm vào nếu chúng có giá trị.
    const requestParams: any = {
      page: page.toString(),
      limit: limit.toString(),
    };

    // --- ĐẦU CHỜ CHO CÁC THAM SỐ LỌC THẬT TẾ ---
    // KHI BẠN CÓ API THẬT HỖ TRỢ LỌC, HÃY UNCOMMENT CÁC DÒNG DƯỚI ĐÂY
    // VÀ ĐẢM BẢO TÊN THAM SỐ TRÙNG KHỚP VỚI API CỦA BẠN.
    // Ví dụ: requestParams.productName = filters.searchKey;
    // Ví dụ: requestParams.startDate = filters.fromDate.toISOString();

    if (filters.searchKey) {
      requestParams.searchKey = filters.searchKey; // Đảm bảo tên param khớp với backend của bạn
    }
    if (filters.fromDate) {
      requestParams.fromDate = filters.fromDate.toISOString();
    }
    if (filters.toDate) {
      requestParams.toDate = filters.toDate.toISOString();
    }
    if (filters.department?.id) {
      requestParams.departmentId = filters.department.id;
    }
    if (filters.requester?.id) {
      requestParams.requesterId = filters.requester.id;
    }

    console.log(
      '--- fetchCreatePrice: Making ACTUAL API call to:',
      apiUrl,
      'with params:',
      requestParams,
      '---',
    );

    // Thực hiện cuộc gọi API bằng Axios
    const { data } = await axios.get(apiUrl, { params: requestParams });

    // Tạo dữ liệu mock từ phản hồi của API
    // Vì bạn đang dùng Picsum Photos (API trả về list ảnh ngẫu nhiên),
    // chúng ta vẫn cần generateMockCreatePriceData để tạo dữ liệu có cấu trúc TypeCreatePrice.
    // Khi tích hợp với API thật, bạn sẽ thay thế phần này bằng cách map dữ liệu API thật
    // sang cấu trúc TypeCreatePrice của bạn.
    let processedData: TypeCreatePrice[] = data.map(
      (item: any) => generateMockCreatePriceData(item, filters), // Truyền toàn bộ filters để generateMock có thể giả lập lọc tốt hơn
    );

    // Lưu vào cache (GIỮ NGUYÊN THEO YÊU CẦU CỦA BẠN)
    cache.set(cacheKey, processedData);

    // Giới hạn kích thước cache để tránh memory leak (GIỮ NGUYÊN THEO YÊU CẦU CỦA BẠN)
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    console.log('--- fetchCreatePrice: API call finished for filters:', filters, '---');

    return processedData;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Create Price:', error);
    throw error; // Ném lỗi để TanStack Query có thể bắt và xử lý
  }
};

export const deleteCreatePrice = async (id: string) => {
  try {
    // Luôn trả về true để demo UI update, trong thực tế sẽ gọi API delete
    return true;
    // const response = await axios.delete(`/create-price/${id}`);
    // if (response.status === 200) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.error('Error deleting item on backend:', error);
    return false;
  }
};

/**
 * Clear cache khi cần thiết (GIỮ NGUYÊN THEO YÊU CẦU CỦA BẠN)
 */
export const clearCreatePriceCache = () => {
  cache.clear();
  console.log('--- Internal Create Price Cache Cleared ---');
};
