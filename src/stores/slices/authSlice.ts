import { StateCreator } from 'zustand';
import { LoginCredentials, RegisterData, CreateShopData, User } from '../../types/auth';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  createShop: (data: CreateShopData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  ...initialState,

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        user: {
          id: '1',
          email: credentials.email,
          name: 'Test User',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during login',
        isLoading: false,
      });
    }
  },

  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true, error: null });

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        user: {
          id: '1',
          email: data.email,
          name: 'New User',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during registration',
        isLoading: false,
      });
    }
  },

  createShop: async (data: CreateShopData) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set((state) => ({
        user: state.user ? {
          ...state.user,
          shop: {
            name: data.shopName,
            category: data.category,
            address: data.address
          }
        } : null,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred while creating the shop',
        isLoading: false,
      });
    }
  },

  logout: () => {
    set(initialState);
  },

  clearError: () => {
    set({ error: null });
  },
});
