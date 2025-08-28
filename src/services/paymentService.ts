import { PaymentData, PaymentResponse, PaymentStatus } from '../stores/paymentStore';
import { authFetch } from '../utils/authFetch';

export const API_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const createMobbexCheckout = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  try {
    const response = await authFetch(`${API_URL}/api/payments/checkout`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating Mobbex checkout:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  try {
    const response = await authFetch(`${API_URL}/api/payments/status/${paymentId}`, {
      method: 'GET',
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

export const getPaymentHistory = async (): Promise<any[]> => {
  try {
    const response = await authFetch(`${API_URL}/api/payments/history`, {
      method: 'GET',
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting payment history:', error);
    throw error;
  }
};
