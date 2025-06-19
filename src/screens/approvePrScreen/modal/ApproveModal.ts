import axios from 'axios';

export interface TypeApprove {
  id: string;
  content: string;
  images: string[];
  videos: string[];
  user: {
    name: string;
    avatar: string;
  };
}

/**
 * Tạo URL API lấy danh sách ảnh, có hỗ trợ search (giả lập).
 */
function buildApproveUrl(page: number, limit: number, key?: string): string {
  let url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
  if (key) url += `&search=${encodeURIComponent(key)}`;
  return url;
}

/**
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 */
export const fetchApproveData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<TypeApprove[]> => {
  const url = buildApproveUrl(page, limit, key);
  const { data } = await axios.get(url);

  const allImageIds: string[] = data.map((item: any) => item.id);

  return data.map((item: any, index: number) => {
    const numberOfImages = Math.floor(Math.random() * 10) + 1;
    const otherIds = allImageIds.filter(id => id !== item.id);
    const shuffled = [...otherIds].sort(() => 0.5 - Math.random());
    const selectedImageIds = [item.id, ...shuffled.slice(0, numberOfImages - 1)];
    const imageUrls = selectedImageIds.map(id => `https://picsum.photos/id/${id}/300/300`);
    return {
      id: item.id,
      content: `PR20240624#0001#${(page - 1) * limit + index + 1}`,
      images: imageUrls,
      videos: [],
      user: {
        name: item.author,
        avatar: `https://picsum.photos/id/${item.id}/100/100`,
      },
    };
  });
};
