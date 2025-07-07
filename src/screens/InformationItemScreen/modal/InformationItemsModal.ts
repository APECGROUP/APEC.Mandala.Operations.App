import { fakeData, fakeEnd, fakeNcc, fakeNote } from '@/data/DataFake';
import { typeNcc } from '@/screens/authScreen/LoginScreen';
import axios from 'axios';

export interface DataInformationItems {
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
export const fetchInformationItemsData = async (
  page: number,
  limit: number = 50,
  id: number,
): Promise<DataInformationItems[]> => {
  const { data } = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);

  return data.map((item: any) => ({
    id: `${item.id}i${id}`,
    name: fakeData[Math.floor(Math.random() * fakeData.length)],
    price: null,
    end: fakeEnd[Math.floor(Math.random() * fakeEnd.length)],
    quantity: 100,
    approvedQty: 100,
    ncc: fakeNcc[Math.floor(Math.random() * fakeNcc.length)],
    nccId: '1',
    supplier: {
      id: '1',
      name: fakeNcc[Math.floor(Math.random() * fakeNcc.length)],
    },
    note: fakeNote[Math.floor(Math.random() * fakeNote.length)],
    approvedAmount: 100000,
  }));
};
