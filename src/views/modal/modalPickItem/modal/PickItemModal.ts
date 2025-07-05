import axios from 'axios';
import { ResponseNcc } from '../../modalPickNcc/modal/PickNccModal';
import { fakeData } from '@/data/DataFake';

export interface IPickItem {
  id: string | undefined;
  name: string | undefined;
  ncc: string | undefined;
  price: number | undefined;
  time: string | undefined;
  vat: string | undefined;
  end: string | undefined;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  supplier: ResponseNcc;
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
export const fetchPickItemData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickItem[]> => {
  const url = buildNccUrl(page, limit, key);
  const { data } = await axios.get(url);

  return data.map((item: any) => ({
    id: item.id,
    ncc: 'Công Ty TNHH XNK Thuận Phát',
    supplier: {
      id: '1',
      name: 'Công Ty TNHH XNK Thuận Phát',
      code: '1234567890',
      address: '1234567890',
      phone: '1234567890',
    },
    price: 100000,
    time: '28/05/2025 - 30/05/2025',
    vat: 'V8',
    end: 'Chai',
    dateFrom: '28/05/2025',
    dateTo: '30/05/2025',
    name: fakeData[Math.floor(Math.random() * 50)],
  }));
};
