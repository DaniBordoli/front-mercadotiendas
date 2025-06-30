import { create } from 'zustand';
import { getStorageItem } from '../../utils/storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ShopInstitutional {
  _id: string;
  shop: string;
  description?: string;
  mission?: string;
  vision?: string;
  history?: string;
  values?: string;
  createdAt: string;
  updatedAt: string;
}

interface ShopInstitutionalState {
  institutional: ShopInstitutional | null;
  loading: boolean;
  error: string | null;
  getShopInstitutional: () => Promise<void>;
  updateShopInstitutional: (data: {
    description?: string;
    mission?: string;
    vision?: string;
    history?: string;
    values?: string;
  }) => Promise<void>;
  clearError: () => void;
}

export const useShopInstitutionalStore = create<ShopInstitutionalState>((set, get) => ({
  institutional: null,
  loading: false,
  error: null,

  getShopInstitutional: async () => {
    const token = getStorageItem('token');
    if (!token) throw new Error('No authentication token found');

    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/shop-institutional/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener información institucional');
      }

      const result = await response.json();
      set({ institutional: result.data?.institutional, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateShopInstitutional: async (data) => {
    const token = getStorageItem('token');
    if (!token) throw new Error('No authentication token found');

    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/shop-institutional/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar información institucional');
      }

      const result = await response.json();
      set({ institutional: result.data?.institutional, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
