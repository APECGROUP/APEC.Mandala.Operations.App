// views/modal/CreatePoModal.ts

import axios from 'axios';
import {
  fakeData,
  fakeNcc,
  fakeEnd,
  fakeVat,
  mockRequesters,
  mockDepartments,
} from '@/data/DataFake';
// Đảm bảo moment được import nếu bạn dùng nó cho Date objects

export interface TypeCreatePo {
  id: string;
  name: string;
  price: string | number;
  expanded?: boolean;
  time?: string;
  vat?: string;
  ncc?: string;
  end?: string;
  createdAt?: string; // Giả sử là ISO string hoặc Date object
  estimateDate?: string; // Giả sử là ISO string hoặc Date object
  department?: SelectedOption;
  requester?: SelectedOption;
  status?: SelectedOption;
}

export interface SelectedOption {
  id: string;
  name: string;
}

export interface CreatePoFilters {
  prNo?: string; // Tên cũ là prNo
  fromDate?: Date;
  toDate?: Date;
  department?: SelectedOption;
  requester?: SelectedOption;
  product?: SelectedOption;
  ncc?: SelectedOption;
  status?: SelectedOption;
}

/**
 * Hàm giả lập để tạo dữ liệu TypeCreatePo.
 * Logic tạo dữ liệu ngẫu nhiên được tách ra để dễ quản lý.
 */
function generateMockCreatePoData(item: any, filters: CreatePoFilters): TypeCreatePo {
  // Lưu ý: Picsum Photos không hỗ trợ lọc, nên bạn vẫn sẽ nhận ảnh ngẫu nhiên.
  // Đây là phần bạn sẽ thay thế bằng logic mapping từ API thật.

  let contentName = fakeData[Math.floor(Math.random() * 50)];
  let ncc = fakeNcc[Math.floor(Math.random() * 10)];
  let status = { id: '', name: '' };

  // Nếu có searchKey, giả lập rằng tên sản phẩm được lọc theo searchKey
  // (mặc dù API picsum không thực sự lọc)
  if (filters.product?.name && filters.product.name !== '') {
    contentName = filters.product.name; // Đảm bảo searchKey xuất hiện trong tên
  }
  if (filters.ncc?.name && filters.ncc.name !== '') {
    ncc = filters.ncc.name;
  }
  if (filters.status?.name && filters.status.name !== '') {
    status = filters.status;
  }

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
    vat: fakeVat[Math.floor(Math.random() * 6)],
    ncc: ncc, // Giả lập
    end: fakeEnd[Math.floor(Math.random() * 5)], // Giả lập
    department: randomDepartment,
    requester: randomRequester,
    status: status,
  };
}

/**
 * Lấy danh sách TypeCreatePo từ API (giả lập) và áp dụng bộ lọc.
 *
 * @param page Số trang cần lấy.
 * @param limit Số lượng item trên mỗi trang.
 * @param filters Đối tượng chứa tất cả các điều kiện lọc.
 * @returns Promise chứa mảng TypeCreatePo.
 */
export const fetchCreatePo = async (
  page: number,
  limit: number = 50,
  filters: CreatePoFilters = {},
): Promise<TypeCreatePo[]> => {
  try {
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

    // if (filters.prNo) {
    //   requestParams.prNo = filters.prNo; // Đảm bảo tên param khớp với backend của bạn
    // }
    // if (filters.fromDate) {
    //   requestParams.fromDate = filters.fromDate.toISOString();
    // }
    // if (filters.toDate) {
    //   requestParams.toDate = filters.toDate.toISOString();
    // }
    // if (filters.department?.id) {
    //   requestParams.departmentId = filters.department.id;
    // }
    // if (filters.requester?.id) {
    //   requestParams.requesterId = filters.requester.id;
    // }
    // if (filters.product?.id) {
    //   requestParams.productId = filters.product.id;
    // }
    // if (filters.ncc?.id) {
    //   requestParams.nccId = filters.ncc.id;
    // }
    // if (filters.status?.id) {
    //   requestParams.statusId = filters.status.id;
    // }
    if (filters?.prNo?.trim().toLowerCase() === 'empty') {
      return [];
    }
    console.log('alo:', requestParams);
    // Thực hiện cuộc gọi API bằng Axios
    const { data } = await axios.get(apiUrl, { params: requestParams });

    // Tạo dữ liệu mock từ phản hồi của API
    // Vì bạn đang dùng Picsum Photos (API trả về list ảnh ngẫu nhiên),
    // chúng ta vẫn cần generateMockCreatePoData để tạo dữ liệu có cấu trúc TypeCreatePo.
    // Khi tích hợp với API thật, bạn sẽ thay thế phần này bằng cách map dữ liệu API thật
    // sang cấu trúc TypeCreatePo của bạn.
    let processedData: TypeCreatePo[] = data.map(
      (item: any) => generateMockCreatePoData(item, filters), // Truyền toàn bộ filters để generateMock có thể giả lập lọc tốt hơn
    );

    console.log('--- fetchCreatePo: API call finished for filters:', filters, '---');

    return processedData;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Create Price:', error);
    throw error; // Ném lỗi để TanStack Query có thể bắt và xử lý
  }
};

export const deleteCreatePo = async (id: string) => {
  try {
    // Luôn trả về true để demo UI update, trong thực tế sẽ gọi API delete
    return id;
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
