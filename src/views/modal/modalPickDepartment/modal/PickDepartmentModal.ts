import { mockDepartments } from '@/data/DataFake';
import axios from 'axios';

export interface TypePickDepartment {
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
export const fetchDepartmentData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<TypePickDepartment[]> => {
  const url = buildNccUrl(page, limit, key);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await axios.get(url);

  return mockDepartments.map(item => ({
    id: item.id,
    name: item.name,
  }));
};
