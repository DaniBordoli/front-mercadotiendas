import { useAuthStore } from './slices/authSlice';
import { useUIStore } from './slices/uiSlice';
import { useShopStore } from './slices/shopStore';
import { useSearchStore } from './searchStore';
import type { Product, SortOrder } from './searchStore';

export { useAuthStore, useUIStore, useShopStore, useSearchStore };
export type { Product, SortOrder };
