import axios from 'axios';

// Gọi API refresh token
export const refreshTokenAPI = async (refreshToken: string) => {
  try {
    const response = await axios.post('https://api.example.com/refresh-token', {
      refreshToken,
    });
    return response.data; // { accessToken, refreshToken }
  } catch (error) {
    return null;
  }
};
