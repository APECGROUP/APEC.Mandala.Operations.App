import axios from 'axios';
import { fakeLocal } from '@/data/DataFake';

export interface IPickLocal {
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
export const fetchPickLocalData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickLocal[]> => {
  const url = buildNccUrl(page, limit, key);
  const { data } = await axios.get(url);

  return data.map((item: any) => ({
    id: item.id,

    name: fakeLocal[Math.floor(Math.random() * 5)],
  }));
};
