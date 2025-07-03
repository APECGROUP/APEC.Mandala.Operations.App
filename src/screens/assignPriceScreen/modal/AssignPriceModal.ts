import axios from 'axios';

// --- (Các interfaces không thay đổi) ---
export interface SelectedOption {
  id: string;
  name: string;
}

export interface AssignPriceFilters {
  prNo?: string;
  fromDate?: Date;
  toDate?: Date;
  department?: SelectedOption;
  requester?: SelectedOption;
}

export interface DataAssignPrice {
  id: string;
  content: string;
  images: string[];
  videos: string[];
  time: string;
  user: {
    name: string;
    avatar: string;
  };
  department: { id: string; name: string };
  requester: { id: string; name: string };
  createdAt: string;
  estimateDate: string;
}

/**
 * Hàm giả lập để tạo dữ liệu DataAssignPrice.
 * Logic tạo dữ liệu ngẫu nhiên được tách ra để dễ quản lý.
 */
function generateMockAssignPriceData(
  item: any,
  prNo?: string,
  fromDate?: Date,
  toDate?: Date,
): DataAssignPrice {
  const numberOfImages = Math.floor(Math.random() * 10) + 1;
  const imageUrls = Array.from(
    { length: numberOfImages },
    (_, i) => `https://picsum.photos/id/${item.id + i}/300/300`,
  );

  let content = `PR20240624#${String(Math.floor(Math.random() * 10000) + 1).padStart(4, '0')}`;
  if (prNo) {
    content = `${content} - ${prNo}`; // Thêm prNo để có thể test filter
  }
  const createdAt = fromDate ? fromDate : new Date();
  const estimateDate = toDate ? toDate : new Date();

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

  const randomDepartment = mockDepartments[Math.floor(Math.random() * mockDepartments.length)];
  const randomRequester = mockRequesters[Math.floor(Math.random() * mockRequesters.length)];
  return {
    id: item.id,
    content,
    images: imageUrls,
    videos: [],
    time: '28/05/2025 - 30/05/2025',
    user: {
      name: item.author,
      avatar: `https://picsum.photos/id/${item.id}/100/100`,
    },
    department: randomDepartment,
    requester: randomRequester,
    createdAt: createdAt, // Giả định ngày tạo cố định
    estimateDate: estimateDate, // Giả định ngày ước tính cố định
  };
}

/**
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 * Đây là hàm chính bạn sẽ thay thế bằng cuộc gọi API thật của mình.
 *
 * @param page Số trang cần lấy.
 * @param limit Số lượng item trên mỗi trang.
 * @param filters Đối tượng chứa tất cả các điều kiện lọc.
 * @returns Promise chứa mảng DataAssignPrice.
 */
export const fetchAssignPriceData = async (
  page: number,
  limit: number = 50,
  filters: AssignPriceFilters, // Nhận toàn bộ object filters
): Promise<DataAssignPrice[]> => {
  try {
    const apiUrl = `https://picsum.photos/v2/list`;

    const requestParams: any = {
      page: page.toString(),
      limit: limit.toString(),
    };

    // --- ĐẦU CHỜ CHO CÁC THAM SỐ LỌC THẬT TẾ ---
    // KHI BẠN CÓ API THẬT HỖ TRỢ LỌC, HÃY UNCOMMENT CÁC DÒNG DƯỚI ĐÂY
    // VÀ ĐẢM BẢO TÊN THAM SỐ TRÙNG KHỚP VỚI API CỦA BẠN.
    // Ví dụ: requestParams.pr_number = filters.prNo;

    // if (filters.prNo) {
    //   requestParams.prNo = filters.prNo;
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

    const { data } = await axios.get(apiUrl, { params: requestParams });

    let processedData: DataAssignPrice[] = data.map((item: any) =>
      generateMockAssignPriceData(item, filters.prNo, filters.fromDate, filters.toDate),
    );

    return processedData;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Assign Price:', error);
    throw error; // Ném lỗi để TanStack Query có thể bắt và xử lý
  }
};
