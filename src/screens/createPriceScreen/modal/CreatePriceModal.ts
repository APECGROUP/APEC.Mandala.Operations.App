import axios from 'axios';

export interface TypeCreatePrice {
  id: string;
  name: string;
  price: string;
  expanded?: boolean;
  time?: string;
  vat?: string;
  ncc?: string;
  end?: string;
}

/**
 * Tạo URL API lấy danh sách ảnh, có hỗ trợ search (giả lập).
 */
function buildCreatePriceUrl(
  page: number,
  limit: number,
  key?: string,
): string {
  let url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
  if (key) url += `&search=${encodeURIComponent(key)}`;
  return url;
}

/**
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 */
export const fetchCreatePrice = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<TypeCreatePrice[]> => {
  const url = buildCreatePriceUrl(page, limit, key);
  const {data} = await axios.get(url);

  return data.map((item: any, index: number) => {
    return {
      id: item.id,
      name: item.author,
      price: 100000 * (page + 1) + index * 150 + limit * 500,
      expanded: false,
      time: '28/05/2025 - 30/05/2025',
      vat: 'V8',
      ncc: 'Công Ty TNHH XNK Thuận Phát',
      end: 'Chai',
    };
  });
};

export const deleteCreatePrice = async (id: string) => {
  try {
    const response = await axios.delete(`/create-price/${id}`);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
