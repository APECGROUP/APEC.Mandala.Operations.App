import axios from 'axios';
import {Post} from '../models/Post';

export const fetchPosts = async (
  page: number,
  limit: number = 50,
): Promise<Post[]> => {
  const response = await axios.get(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`,
  );

  const allImageIds: string[] = response.data.map((item: any) => item.id);

  return response.data.map((item: any, index: number) => {
    // Chọn ngẫu nhiên số lượng ảnh (1–5)
    const numberOfImages = Math.floor(Math.random() * 10) + 1;

    // Lọc danh sách ID trừ ID gốc để tránh lặp
    const otherIds = allImageIds.filter(id => id !== item.id);

    // Xáo trộn và chọn ngẫu nhiên các ID không trùng
    const shuffled = otherIds.sort(() => 0.5 - Math.random());
    const selectedImageIds = [
      item.id,
      ...shuffled.slice(0, numberOfImages - 1),
    ];

    const imageUrls = selectedImageIds.map(
      id => `https://picsum.photos/id/${id}/300/300`,
    );

    return {
      id: item.id,
      content: `Ảnh của ${item.author} ${(page - 1) * limit + index}`,
      images: imageUrls,
      videos: [],
      user: {
        name: item.author,
        avatar: `https://picsum.photos/id/3${item.id}/100/100`,
      },
    };
  });
};
