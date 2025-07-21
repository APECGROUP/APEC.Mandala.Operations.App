import { BASE_URL } from '@/env';
import axios from 'axios';

export const getRoomDetail = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/room/${id}`);
    if (response.status !== 200) {
      throw new Error();
    }
    // return response.data;
    return {
      id: '1',
      roomNumber: '101 - DL1',
      floor: 'Tầng 1',
      numberOfGuests: '02',
    };
  } catch (error) {
    throw error;
  }
};
