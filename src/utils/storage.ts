import { StateStorage } from 'zustand/middleware';

const storagePrefix = 'mercadotiendas_';

export const storage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return window.localStorage.getItem(`${storagePrefix}${name}`);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      window.localStorage.setItem(`${storagePrefix}${name}`, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      window.localStorage.removeItem(`${storagePrefix}${name}`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};
