import { StateCreator } from 'zustand';

export interface UISlice {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const initialState = {
  theme: 'light' as const,
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
};

export const createUISlice: StateCreator<UISlice> = (set) => ({
  ...initialState,

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
});
