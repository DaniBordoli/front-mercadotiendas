import { StateStorage } from 'zustand/middleware';

const storagePrefix = 'mercadotiendas_';



export const storage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return window.localStorage.getItem(`${storagePrefix}${name}`);
    } catch (error) {

      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      window.localStorage.setItem(`${storagePrefix}${name}`, value);
    } catch (error) {

    }
  },
  removeItem: (name: string): void => {
    try {
      window.localStorage.removeItem(`${storagePrefix}${name}`);
    } catch (error) {

    }
  },
};


export const getStorageItem = (key: string): string | null => {

  let value = localStorage.getItem(`${storagePrefix}${key}`);
  

  if (value === null) {
    value = localStorage.getItem(key);

    if (value !== null) {
      setStorageItem(key, value);
      localStorage.removeItem(key);

    }
  }
  
  return value;
};

export const setStorageItem = (key: string, value: string): void => {
  localStorage.setItem(`${storagePrefix}${key}`, value);
};

export const removeStorageItem = (key: string): void => {
  localStorage.removeItem(`${storagePrefix}${key}`);
  localStorage.removeItem(key);
};
