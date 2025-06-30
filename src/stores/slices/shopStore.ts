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
    updateShopStatus: (shopId: string, active: boolean) => Promise<void>;
    isShopActive: () => boolean;
    checkShopAccess: () => { canAccess: boolean; message: string };
    updateShopInstitutional: (data: { description?: string; mission?: string; vision?: string; history?: string; values?: string }) => Promise<void>;
    updateShopColors: (data: { primaryColor?: string; secondaryColor?: string; accentColor?: string }) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
    shop: null,
    loading: false,
    error: null,

    updateShopInfo: async (shopId: string, data: any, imageFile?: File) => {
        const token = getStorageItem('token');
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
                
                // Actualizar el usuario en authStore y forzar refresh completo
                const authStore = useAuthStore.getState();
                if (authStore.user) {
                    // Actualizar la referencia de la tienda en el usuario
                    authStore.user.shop = result.shop;
                    useAuthStore.setState({ user: authStore.user });
                    
                    // Forzar recarga del perfil para mantener sincronización
                    if (authStore.forceLoadProfile) {
                        authStore.forceLoadProfile().catch(console.error);
                    }
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
                
                // Actualizar el usuario en authStore y forzar refresh completo
                const authStore = useAuthStore.getState();
                if (authStore.user) {
                    // Actualizar la referencia de la tienda en el usuario
                    authStore.user.shop = result.shop;
                    useAuthStore.setState({ user: authStore.user });
                    
                    // Forzar recarga del perfil para mantener sincronización
                    if (authStore.forceLoadProfile) {
                        authStore.forceLoadProfile().catch(console.error);
                    }
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
            
           
            let body;
            let headers: any = {
                'Authorization': `Bearer ${token}`
            };

            if (data.image) {
              
                const formData = new FormData();
                
               
                Object.keys(data).forEach(key => {
                    if (key !== 'image' && data[key] !== undefined) {
                        formData.append(key, String(data[key]));
                    }
                });
                
           
                formData.append('image', data.image);
                
                body = formData;
             
            } else {
               
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(data);
            }

            const response = await fetch(`${API_URL}/shops`, {
                method: 'POST',
                headers,
                body
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
        const token = getStorageItem('token');
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

    updateShopStatus: async (shopId: string, active: boolean) => {
        const token = getStorageItem('token');
        if (!token) throw new Error('No authentication token found');

        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_URL}/shops/${shopId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ active }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al actualizar el estado de la tienda');
            }

            const result = await response.json();
            set({ shop: result.shop, loading: false });
            
            // Actualizar el usuario en authStore y forzar refresh completo
            const authStore = useAuthStore.getState();
            if (authStore.user) {
                // Actualizar la referencia de la tienda en el usuario
                authStore.user.shop = result.shop;
                useAuthStore.setState({ user: authStore.user });
                
                // Forzar recarga del perfil para mantener sincronización
                if (authStore.forceLoadProfile) {
                    authStore.forceLoadProfile().catch(console.error);
                }
            }
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
            throw error;
        }
    },

    isShopActive: () => {
        const { shop } = get();
        
        // Si no hay tienda en shopStore, intentar obtenerla del authStore
        if (!shop) {
            const authStore = useAuthStore.getState();
            const userShop = authStore.user?.shop;
            
            if (userShop) {
                // Sincronizar la tienda del authStore al shopStore
                set({ shop: userShop });
                return userShop.active === true;
            }
            
            return false;
        }
        
        return shop?.active === true;
    },

    checkShopAccess: () => {
        const { shop } = get();
        
        // Si no hay tienda en shopStore, intentar obtenerla del authStore
        if (!shop) {
            const authStore = useAuthStore.getState();
            const userShop = authStore.user?.shop;
            
            if (userShop) {
                // Sincronizar la tienda del authStore al shopStore
                set({ shop: userShop });
                
                if (!userShop.active) {
                    return { canAccess: false, message: 'Habilite su tienda para ingresar' };
                }
                return { canAccess: true, message: '' };
            }
            
            return { canAccess: false, message: 'No tiene una tienda asociada' };
        }
        
        if (!shop.active) {
            return { canAccess: false, message: 'Habilite su tienda para ingresar' };
        }
        return { canAccess: true, message: '' };
    },

    updateShopInstitutional: async (data: { description?: string; mission?: string; vision?: string; history?: string; values?: string }) => {
        const { shop } = get();
        if (!shop) throw new Error('No shop found');
        
       
        await get().updateShopInfo(shop._id, data);
    },

    updateShopColors: async (data: { primaryColor?: string; secondaryColor?: string; accentColor?: string }) => {
        const { shop } = get();
        if (!shop) throw new Error('No shop found');
        
        // Actualizar tienda en backend
        await get().updateShopInfo(shop._id, data);
        
        // Sincronizar con firstLayoutStore
        const { useFirstLayoutStore } = await import('../firstLayoutStore');
        const { updateEditableVariables } = useFirstLayoutStore.getState();
        
        const colorUpdates: any = {
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            accentColor: data.accentColor,
        };
        
        // NavBar con fondo acento si existe, sino usar color principal
        if (data.accentColor) {
            colorUpdates.navbarBackgroundColor = data.accentColor;
            colorUpdates.navbarTitleColor = data.primaryColor || '#000000';
            colorUpdates.navbarLinksColor = data.primaryColor || '#000000';
            colorUpdates.navbarIconsColor = data.primaryColor || '#000000';
        } else if (data.primaryColor) {
            colorUpdates.navbarBackgroundColor = data.primaryColor;
            colorUpdates.navbarTitleColor = '#FFFFFF';
            colorUpdates.navbarLinksColor = '#FFFFFF';
            colorUpdates.navbarIconsColor = '#FFFFFF';
        }
        
        if (data.primaryColor) {
            colorUpdates.heroBackgroundColor = data.primaryColor;
        }
        
        if (data.secondaryColor) {
            colorUpdates.buttonBackgroundColor = data.secondaryColor;
            colorUpdates.buttonTextColor = '#FFFFFF';
            colorUpdates.featuredProductsCardButtonColor = data.secondaryColor;
            colorUpdates.featuredProductsCardButtonTextColor = '#FFFFFF';
        } else if (data.primaryColor) {
            colorUpdates.buttonBackgroundColor = '#FFFFFF';
            colorUpdates.buttonTextColor = data.primaryColor;
            colorUpdates.featuredProductsCardButtonColor = '#FFFFFF';
            colorUpdates.featuredProductsCardButtonTextColor = data.primaryColor;
        }
        
        updateEditableVariables(colorUpdates);
    },

    setShop: (shop: Shop | null) => set({ shop }),
    clearError: () => set({ error: null })
}));
