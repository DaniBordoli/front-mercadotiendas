import { create } from 'zustand';
import { API_URL } from '../../services/api';
import { Shop } from '../../types/auth';
import { useAuthStore } from '../';
import { getStorageItem, setStorageItem } from '../../utils/storage';

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
        const token = getStorageItem('token');
        if (!token) throw new Error('No authentication token found');
        set({ loading: true, error: null });
        try {
            console.log("Sending data to backend for shop creation:", data);
            const response = await fetch(`${API_URL}/shops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Backend error response:", result);
                throw new Error(result.message || 'Error al crear la tienda');
            }

            if (!result.success || !result.data || !result.data.shop) {
                console.error("Invalid success response structure:", result);
                throw new Error("Respuesta inesperada del servidor al crear tienda.");
            }

            const newShop = result.data.shop as Shop;

            // Update user state in authStore and local storage
            const authStore = useAuthStore.getState();
            if (authStore.user) {
                const updatedUser = { ...authStore.user, shop: newShop };
                setStorageItem('user', JSON.stringify(updatedUser));
                useAuthStore.setState({ user: updatedUser });
                console.log("Auth store user updated with new shop info.");
            }

            set({ shop: newShop, loading: false });
            console.log("Shop created successfully in store:", newShop);

        } catch (error) {
            console.error("Error caught in createShop store action:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during shop creation';
            set({ error: errorMessage, loading: false });
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
            set({ shop: result.data?.shop, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
            throw error;
        }
    },

    setShop: (shop: Shop | null) => set({ shop }),
    clearError: () => set({ error: null })
}));
