import { create } from 'zustand';

export interface UISlice {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  isInitialLoading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setInitialLoading: (value: boolean) => void;
}

export const useUIStore = create<UISlice>((set) => ({
  theme: 'light',
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  isInitialLoading: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  openModal: (content) => set({ 
    isModalOpen: true, 
    modalContent: content 
  }),
  closeModal: () => set({ 
    isModalOpen: false, 
    modalContent: null 
  }),
  setInitialLoading: (value: boolean) => set({ isInitialLoading: value })
}));
