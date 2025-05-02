import { create } from 'zustand';
import { API_URL } from '../../services/api';
import { Shop } from '../../types/auth';
import { useAuthStore } from '../';

interface ShopState {
    shop: Shop | null;
    loading: boolean;
    error: string | null;
    updateShopInfo: (shopId: string, data: any, imageFile?: File) => Promise<void>;
    createShop: (data: any) => Promise<void>;
    setShop: (shop: Shop | null) => void;
    clearError: () => void;
    getShop: () => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
    shop: null,
    loading: false,
    error: null,

    updateShopInfo: async (shopId: string, data: any, imageFile?: File) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        set({ loading: true, error: null });

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });

                const response = await fetch(`${API_URL}/shops/${shopId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Error al actualizar la tienda');
                }

                const result = await response.json();
                set({ shop: result.shop, loading: false });
                // Actualizar el usuario en authStore
                const authStore = useAuthStore.getState();
                if (authStore.user) {
                    authStore.user.shop = result.shop;
                    useAuthStore.setState({ user: authStore.user });
                }
            } else {
                const response = await fetch(`${API_URL}/shops/${shopId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Error al actualizar la tienda');
                }

                const result = await response.json();
                set({ shop: result.shop, loading: false });
                // Actualizar el usuario en authStore
                const authStore = useAuthStore.getState();
                if (authStore.user) {
                    authStore.user.shop = result.shop;
                    useAuthStore.setState({ user: authStore.user });
                }
            }
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
            throw error;
        }
    },

    createShop: async (data: any) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ shop: data })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al crear la tienda');
            }

            const result = await response.json();
            set({ shop: result.shop, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
            throw error;
        }
    },

    getShop: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_URL}/shops/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error fetching shop data');
            }

            const result = await response.json();
            set({ shop: result.shop, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
            throw error;
        }
    },

    setShop: (shop: Shop | null) => set({ shop }),
    clearError: () => set({ error: null })
}));
