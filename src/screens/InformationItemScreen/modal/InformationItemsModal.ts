import {typeNcc} from '@/screens/authScreen/LoginScreen';
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
): Promise<DataInformationItems[]> => {
  const {data} = await axios.get(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`,
  );

  return data.map((item: any, index: number) => ({
      id: item.id,
      name: `Táo đỏ khô${(page - 1) * limit + index + 1}`,
      price: null,
      end: 'Chai',
      quantity: 100,
      approvedQty: 100,
      ncc: 'Công Ty TNHH XNK Thuận Phát',
      nccId: '1',
      supplier: {
        id: '1',
        name: 'Công Ty TNHH XNK Thuận Phát',
      },
      note: 'Lorem Ipsum is simply dummy text of the printing and typese tting industry',
      approvedAmount: 100000,
    }));
};
