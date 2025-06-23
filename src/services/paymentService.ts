import { getStorageItem } from '../utils/storage';
import { PaymentData, PaymentResponse, PaymentStatus } from '../stores/paymentStore';

export const API_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const createMobbexCheckout = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating Mobbex checkout:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/status/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

export const getPaymentHistory = async (): Promise<any[]> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting payment history:', error);
    throw error;
  }
};
