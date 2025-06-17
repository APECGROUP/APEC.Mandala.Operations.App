import axios from 'axios';

export type SimpleItem = {
  id: string;
  name: string;
};

// Delay để mô phỏng thời gian gọi API (chỉ dùng cho fake)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Tạo mảng giả
const generateFakeData = (prefix: string): SimpleItem[] =>
  Array.from({length: 15}, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${prefix} Name ${i + 1}`,
  }));

/**
 * Department API (fake version)
 * Sau này chỉ cần thay bằng:
 * return axios.get('/department').then(res => res.data);
 */
export const fetchDepartment = async (): Promise<SimpleItem[]> => {
  await delay(500);
  const fakeData = generateFakeData('Department');
  return fakeData;
};

/**
 * Requester API (fake version)
 * Sau này chỉ cần thay bằng:
 * return axios.get('/requester').then(res => res.data);
 */
export const fetchRequester = async (): Promise<SimpleItem[]> => {
  await delay(500);
  const fakeData = generateFakeData('Requester');
  return fakeData;
};
