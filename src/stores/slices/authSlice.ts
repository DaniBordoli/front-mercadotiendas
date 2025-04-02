import { create } from 'zustand';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';
import { LoginCredentials, RegisterData, CreateShopData, User } from '../../types/auth';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  createShop: (data: CreateShopData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!getStorageItem('token'),
  isLoading: false,
  error: null,
  token: getStorageItem('token'),

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const token = 'fake-jwt-token';
      setStorageItem('token', token);
      set({ isAuthenticated: true, token, isLoading: false });
    } catch (error) {
      set({ error: 'Invalid credentials', isLoading: false });
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const token = 'fake-jwt-token';
      setStorageItem('token', token);
      set({ isAuthenticated: true, token, isLoading: false });
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
    }
  },

  createShop: async (data: CreateShopData) => {
    set({ isLoading: true, error: null });
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to create shop', isLoading: false });
    }
  },

  logout: () => {
    removeStorageItem('token');
    set({ token: null, isAuthenticated: false, user: null });
  },

  clearError: () => {
    set({ error: null });
  },

  setToken: (token: string) => {
    setStorageItem('token', token);
    set({ token, isAuthenticated: true });
  },

  clearToken: () => {
    removeStorageItem('token');
    set({ token: null, isAuthenticated: false });
  }
}));
