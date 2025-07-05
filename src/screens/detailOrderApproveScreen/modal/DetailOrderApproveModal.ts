import { typeNcc } from '@/screens/authScreen/LoginScreen';
import { fakeData, fakeNcc } from '@/data/DataFake';
import axios from 'axios';

export interface DetailOrderApprove {
  id: string;
  name: string;
  price: number | null;
  end: string;
  quantity: number;
  approvedQty: number;
  ncc: string;
  nccId: string;
  supplier: typeNcc;
  note: string;
  approvedAmount: number;
}

/**
 * Lấy danh sách DataAssignPrice từ API (giả lập).
 */
export const fetchDetailOrderApproveData = async (
  id: string,
  page: number,
  limit: number = 50,
): Promise<DetailOrderApprove[]> => {
  const { data } = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);

  return data.map((item: any, index: number) => ({
    id: item.id,
    name: fakeData[Math.floor(Math.random() * 50)],
    price: Math.floor(Math.random() * 10000) * 1000,
    end: ['Chai', 'Kg', 'Thùng', 'Hộp', 'Gói'][Math.floor(Math.random() * 5)],
    quantity: Math.floor(Math.random() * 100),
    approvedQty: Math.floor(Math.random() * 100),
    ncc: fakeNcc[Math.floor(Math.random() * 10)],
    nccId: '1',
    supplier: {
      id: '1',
      name: fakeNcc[Math.floor(Math.random() * 10)],
    },
    note: 'Lorem Ipsum is simply dummy text of the printing and typese tting industry',
    approvedAmount: Math.floor(Math.random() * 100) * 1000,
  }));
};
