import axios from 'axios';

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
}

// Cache để tránh gọi API trùng lặp
const cache = new Map<string, DataAssignPrice[]>();

/**
 * Tạo URL API lấy danh sách ảnh, có hỗ trợ search (giả lập).
 */
function buildAssignPriceUrl(page: number, limit: number, key?: string): string {
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
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 */
export const fetchAssignPriceData = async (
  page: number,
  limit: number = 50,
  prNo?: string,
  fromDate?: Date,
  toDate?: Date,
  department?: { id: string },
  requester?: { id: string },
): Promise<DataAssignPrice[]> => {
  const cacheKey = getCacheKey(page, limit, prNo || '');

  // Kiểm tra cache trước
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    // Giả lập delay 3 giây
    await new Promise(resolve => setTimeout(resolve, 800));

    const url = buildAssignPriceUrl(page, limit, prNo);
    const { data } = await axios.get(url);

    const allImageIds: string[] = data.map((item: any) => item.id);

    const result = data.map((item: any) => {
      const numberOfImages = Math.floor(Math.random() * 10) + 1;
      const otherIds = allImageIds.filter(id => id !== item.id);
      const shuffled = [...otherIds].sort(() => 0.5 - Math.random());
      const selectedImageIds = [item.id, ...shuffled.slice(0, numberOfImages - 1)];
      const imageUrls = selectedImageIds.map(id => `https://picsum.photos/id/${id}/300/300`);
      return {
        id: item.id,
        content: `PR20240624#${String(Math.floor(Math.random() * 10000) + 1).padStart(4, '0')}`,
        images: imageUrls,
        videos: [],
        time: '28/05/2025 - 30/05/2025',
        user: {
          name: item.author,
          avatar: `https://picsum.photos/id/${item.id}/100/100`,
        },
      };
    });

    // Lưu vào cache
    cache.set(cacheKey, result);

    // Giới hạn cache size để tránh memory leak
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  } catch (error) {
    console.error('Error fetching assign price data:', error);
    throw error;
  }
};

/**
 * Clear cache khi cần thiết
 */
export const clearAssignPriceCache = () => {
  cache.clear();
};
