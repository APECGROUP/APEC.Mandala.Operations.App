import { fakeLocal } from '@/data/DataFake';
import axios from 'axios';

export interface IPickLocal {
  code: string | undefined;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await axios.get(url);

  return fakeLocal;
};
