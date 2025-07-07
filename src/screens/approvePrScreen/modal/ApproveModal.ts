// views/modal/ApproveModal.ts

import { fakeData, fakeEnd, fakeLocal, fakeNcc, fakeNote, fakeVat } from '@/data/DataFake';
import axios from 'axios';

export interface IApprove {
  prNo: string;
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
  note?: string;
  location?: SelectedOption;
}

export interface SelectedOption {
  id: string;
  name: string;
}

export interface IApproveFilters {
  prNo?: string; // Tên cũ là prNo
  fromDate?: Date;
  toDate?: Date;
  department?: SelectedOption;
  requester?: SelectedOption;
  location?: SelectedOption;
}

/**
 * Hàm giả lập để tạo dữ liệu TypeCreatePrice.
 * Logic tạo dữ liệu ngẫu nhiên được tách ra để dễ quản lý.
 */
function generateMockCreatePriceData(item: any, filters: IApproveFilters): IApprove {
  // Lưu ý: Picsum Photos không hỗ trợ lọc, nên bạn vẫn sẽ nhận ảnh ngẫu nhiên.
  // Đây là phần bạn sẽ thay thế bằng logic mapping từ API thật.

  let contentName = fakeData[Math.floor(Math.random() * 50)];
  let prNo = 'PR20240624#0001';
  let location = { id: '', name: '' };
  // Nếu có searchKey, giả lập rằng tên sản phẩm được lọc theo searchKey
  // (mặc dù API picsum không thực sự lọc)
  if (filters.prNo && !contentName.toLowerCase().includes(filters.prNo.toLowerCase())) {
    contentName = `${filters.prNo} - ${contentName}`; // Đảm bảo searchKey xuất hiện trong tên
    prNo = `${filters.prNo} - ${prNo}`;
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
  if (filters.location?.id && !fakeLocal.some(l => l.id === filters.location?.id)) {
    location = filters.location;
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
    prNo: prNo,
    price: (Math.floor(Math.random() * 100) + 1) * 1000, // Giá ngẫu nhiên
    expanded: false,
    time: '28/05/2025 - 30/05/2025', // Giả lập
    createdAt: createdAt,
    estimateDate: estimateDate,
    location: location,

    vat: fakeVat[Math.floor(Math.random() * 6)],
    ncc: fakeNcc[Math.floor(Math.random() * 10)], // Giả lập
    end: fakeEnd[Math.floor(Math.random() * 5)], // Giả lập
    department: randomDepartment,
    requester: randomRequester,
    note: fakeNote[Math.floor(Math.random() * 10)],
  };
}

/**
 * Lấy danh sách TypeCreatePrice từ API (giả lập) và áp dụng bộ lọc.
 *
 * @param page Số trang cần lấy.
 * @param limit Số lượng item trên mỗi trang.
 * @param filters Đối tượng chứa tất cả các điều kiện lọc.
 * @returns Promise chứa mảng TypeCreatePrice.
 */
export const fetchApprove = async (
  page: number,
  limit: number = 50,
  filters: IApproveFilters = {},
): Promise<IApprove[]> => {
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
    if (filters?.prNo?.trim().toLowerCase() === 'empty') {
      return [];
    }

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

    // Thực hiện cuộc gọi API bằng Axios
    const { data } = await axios.get(apiUrl, { params: requestParams });

    // Tạo dữ liệu mock từ phản hồi của API
    // Vì bạn đang dùng Picsum Photos (API trả về list ảnh ngẫu nhiên),
    // chúng ta vẫn cần generateMockCreatePriceData để tạo dữ liệu có cấu trúc TypeCreatePrice.
    // Khi tích hợp với API thật, bạn sẽ thay thế phần này bằng cách map dữ liệu API thật
    // sang cấu trúc TypeCreatePrice của bạn.
    let processedData: IApprove[] = data.map(
      (item: any) => generateMockCreatePriceData(item, filters), // Truyền toàn bộ filters để generateMock có thể giả lập lọc tốt hơn
    );

    console.log('--- fetchCreatePrice: API call finished for filters:', filters, '---');

    return processedData;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Create Price:', error);
    throw error; // Ném lỗi để TanStack Query có thể bắt và xử lý
  }
};

export const deleteApprove = async (id: string) => {
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
