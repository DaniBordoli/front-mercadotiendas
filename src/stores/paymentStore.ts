import { create } from 'zustand';
import { getStorageItem } from '../utils/storage';
import { authFetch } from '../utils/authFetch';

export interface PaymentData {
  orderData: {
    total: number;
    description: string;
    reference: string;
  };
  customerData: {
    email: string;
    name: string;
    identification: string;
  };
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    success: boolean;
    data: {
      id: string;
      url: string;
      redirectUrl: string; // Añadido: propiedad redirectUrl
    };
    message: string;
  };
  message: string;
}

export interface PaymentStatus {
  id: string;
  status: {
    code: string;
    text: string;
  };
  paymentMethod: string;
  amount: number;
  currency: string;
  createdAt: string;
  reference: string;
}

interface PaymentState {
  // Estado del pago
  isLoading: boolean;
  error: string | null;
  currentPayment: PaymentResponse | null;
  paymentStatus: PaymentStatus | null;
  
  // Acciones
  createCheckout: (paymentData: PaymentData) => Promise<PaymentResponse>;
  checkPaymentStatus: (paymentId: string) => Promise<PaymentStatus>;
  clearPayment: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  // Estado inicial
  isLoading: false,
  error: null,
  currentPayment: null,
  paymentStatus: null,

  // Acciones
  createCheckout: async (paymentData: PaymentData) => {
    console.log('=== PAYMENT STORE: Iniciando createCheckout ===');
    console.log('paymentData recibido:', JSON.stringify(paymentData, null, 2));
    
    set({ isLoading: true, error: null });
    
    try {
      const token = getStorageItem('token');
      console.log('=== PAYMENT STORE: Token de autenticación ===');
      console.log('Token existe:', !!token);
      console.log('Token (primeros 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const apiUrl = `${process.env.REACT_APP_API_URL}/payments/checkout`;
      console.log('=== PAYMENT STORE: Preparando request ===');
      console.log('URL:', apiUrl);
      console.log('Method: POST');
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.substring(0, 20)}...`
      });
      console.log('Body:', JSON.stringify(paymentData, null, 2));

      const response = await authFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      console.log('=== PAYMENT STORE: Respuesta HTTP recibida ===');
      console.log('Status:', response.status);
      console.log('StatusText:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('=== PAYMENT STORE: Error en la respuesta ===');
        console.error('Error data:', JSON.stringify(errorData, null, 2));
        throw new Error(errorData.message || 'Error al crear el checkout');
      }

      const result: PaymentResponse = await response.json();
      console.log('=== PAYMENT STORE: Respuesta exitosa ===');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Asegurarse de que el objeto data sea un objeto plano para evitar problemas de proxy/referencia
      const finalResult: PaymentResponse = {
        ...result,
        data: JSON.parse(JSON.stringify(result.data))
      };

      console.log('=== PAYMENT STORE: Final result before return ===', JSON.stringify(finalResult, null, 2));

      set({ currentPayment: finalResult, isLoading: false });
      return finalResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('=== PAYMENT STORE: Error en createCheckout ===');
      console.error('Error completo:', error);
      console.error('Error message:', errorMessage);
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  checkPaymentStatus: async (paymentId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = getStorageItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await authFetch(`${process.env.REACT_APP_API_URL}/payments/status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al consultar el estado del pago');
      }

      const result: PaymentStatus = await response.json();
      set({ paymentStatus: result, isLoading: false });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearPayment: () => {
    set({
      currentPayment: null,
      paymentStatus: null,
      error: null,
      isLoading: false,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
