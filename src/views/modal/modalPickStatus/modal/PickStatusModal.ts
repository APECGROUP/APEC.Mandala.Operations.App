import axios from 'axios';

export interface IPickStatus {
  code: string | undefined;
  name: string | undefined;
}

export const fetchStatusData = async (
  page: number,
  limit: number = 50,
  key: string = '',
): Promise<IPickStatus[]> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await axios.get('https://picsum.photos/v2/list', {
    params: {
      page: page.toString(),
      limit: limit.toString(),
      key: key.trim(),
    },
  });
  const fakeData = [
    { code: '1', name: 'Chờ TPB duyệt' },
    {
      code: '2',
      name: 'Chờ gắn giá',
    },
    {
      code: '3',
      name: 'Chờ kế toán trưởng duyệt',
    },
    {
      code: '4',
      name: 'Chờ GM/OM duyệt',
    },
    {
      code: '5',
      name: 'Chờ tạo PO',
    },
    {
      code: '6',
      name: 'Đã tạo PO',
    },
  ];
  return fakeData;
};
