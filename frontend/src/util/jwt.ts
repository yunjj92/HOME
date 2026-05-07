import { jwtDecode } from 'jwt-decode';

export const getJwtExpiration = (token: string): number | null => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};
