import axios from 'axios';

export interface ResponseNcc {
  id: string | undefined;
  name: string | undefined;
}

/**
 * Tạo URL API lấy danh sách ảnh, có hỗ trợ search (giả lập).
 */
function buildNccUrl(page: number, limit: number, key?: string): string {
  let url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
  if (key) url += `&search=${encodeURIComponent(key)}`;
  return url;
}

/**
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 */
export const fetchNccData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<ResponseNcc[]> => {
  const url = buildNccUrl(page, limit, key);
  const { data } = await axios.get(url);

  const companyNames = [
    'Công Ty TNHH Thịt Bò Sạch Việt Nam - 150.000',
    'Công Ty CP Chế Biến Thịt Heo Đồng Nai - 180.000',
    'Công Ty TNHH Thịt Gà Tươi Minh Phát - 120.000',
    'Công Ty CP Thịt Bò Mỹ Phẩm - 250.000',
    'Công Ty TNHH Thịt Heo Sạch Bình Dương - 160.000',
    'Công Ty CP Thịt Gà Công Nghiệp Vạn Thắng - 110.000',
    'Công Ty TNHH Thịt Bò Úc Premium - 300.000',
    'Công Ty CP Thịt Heo Tươi Sài Gòn - 170.000',
    'Công Ty TNHH Thịt Gà Ta Đồng Nai - 130.000',
    'Công Ty CP Thịt Bò Nhập Khẩu Hà Nội - 280.000',
    'Công Ty TNHH Thịt Heo Sạch Long An - 155.000',
    'Công Ty CP Thịt Gà Công Nghiệp Bình Phước - 125.000',
    'Công Ty TNHH Thịt Bò Mỹ Chất Lượng Cao - 320.000',
    'Công Ty CP Thịt Heo Tươi Đồng Tháp - 165.000',
    'Công Ty TNHH Thịt Gà Ta Bình Dương - 135.000',
  ];

  return data.map((item: any, index: number) => ({
    id: item.id,
    name: companyNames[index % companyNames.length],
  }));
};
