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

// Cache để tránh gọi API trùng lặp
const cache = new Map<string, TypeCreatePrice[]>();

/**
 * Tạo URL API lấy danh sách ảnh, có hỗ trợ search (giả lập).
 */
function buildCreatePriceUrl(page: number, limit: number, key?: string): string {
  let url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
  if (key) url += `&search=${encodeURIComponent(key)}`;
  return url;
}

/**
 * Tạo cache key
 */
function getCacheKey(page: number, limit: number, key: string): string {
  return `${page}_${limit}_${key}`;
}

/**
 * Lấy danh sách TypeCreatePrice từ API (giả lập).
 */
export const fetchCreatePrice = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<TypeCreatePrice[]> => {
  const cacheKey = getCacheKey(page, limit, key);

  // Kiểm tra cache trước
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const url = buildCreatePriceUrl(page, limit, key);
    const { data } = await axios.get(url);

    const result = data.map((item: any, index: number) => ({
      id: item.id,
      name: item.author,
      price: 100000 * (page + 1) + index * 150 + limit * 500,
      expanded: false,
      time: '28/05/2025 - 30/05/2025',
      vat: 'V8',
      ncc: 'Công Ty TNHH XNK Thuận Phát',
      end: 'Chai',
    }));

    // Lưu vào cache
    cache.set(cacheKey, result);

    // Giới hạn cache size để tránh memory leak
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  } catch (error) {
    console.error('Error fetching create price data:', error);
    throw error;
  }
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

/**
 * Clear cache khi cần thiết
 */
export const clearCreatePriceCache = () => {
  cache.clear();
};
