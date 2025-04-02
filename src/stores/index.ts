import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';

import { AuthSlice, createAuthSlice } from './slices/authSlice';
import { UISlice, createUISlice } from './slices/uiSlice';

export interface StoreState extends AuthSlice, UISlice {}

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUISlice(...args),
    }),
    {
      name: 'mercadotiendas-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);
