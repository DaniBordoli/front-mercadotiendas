import { useAuthStore } from './slices/authSlice';
import { useUIStore } from './slices/uiSlice';
import { useShopStore } from './slices/shopStore';
import { useShopInstitutionalStore } from './slices/shopInstitutionalStore';
import { useSearchStore } from './searchStore';
import { usePaymentStore } from './paymentStore';
import type { Product, SortOrder } from './searchStore';

export { useAuthStore, useUIStore, useShopStore, useShopInstitutionalStore, useSearchStore, usePaymentStore };
export type { Product, SortOrder };
