import { LoginCredentials, RegisterData, User, CreateShopData } from '../types/auth';

export const API_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test/status`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const loginWithGoogle = async (token: string) => {
  try {
    console.log('Attempting Google login with token:', token.substring(0, 20) + '...');
    console.log('API URL:', API_URL);
    const response = await fetch(`${API_URL}/auth/google/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
    }
    return handleResponse(response);
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
};

export const createShop = async (data: CreateShopData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ shop: data }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
};

export const updateProfile = async (token: string, data: Partial<User>) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
