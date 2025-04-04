import { create } from 'zustand';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';
import { LoginCredentials, RegisterData, CreateShopData, User, AuthState, AuthStore } from '../../types/auth';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { API_URL } from '../../services/api';



export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: !!getStorageItem('token'),
  isLoading: false,
  error: null,
  token: getStorageItem('token'),
  needsShopSetup: false,

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Enviar el token de Firebase al backend para obtener nuestro JWT
      const apiUrl = `${API_URL}/auth/google/verify-token`;
      console.log('Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Google sign in failed');
      }
      
      if (!responseData.success || !responseData.data) {
        console.error('Estructura de respuesta inesperada:', responseData);
        throw new Error('Respuesta inválida del servidor');
      }
      
      const { token, user } = responseData.data;
      setStorageItem('token', token);
      set({
        isAuthenticated: true,
        token,
        user,
        isLoading: false,
        needsShopSetup: !user?.shop
      });
      

    } catch (error) {
      console.error('Error en login con Google:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Google sign in failed', 
        isLoading: false 
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const idToken = await result.user.getIdToken();
      
      // Enviar el token de Firebase al backend
      const apiUrl = `${process.env.REACT_APP_API_URL_DEV}/auth/firebase/verify-token`;
      console.log('Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Invalid credentials');
      }
      
      if (!responseData.success || !responseData.data) {
        console.error('Estructura de respuesta inesperada:', responseData);
        throw new Error('Respuesta inválida del servidor');
      }
      
      const { token, user } = responseData.data;
      
      setStorageItem('token', token);
      set({
        isAuthenticated: true,
        token,
        user,
        isLoading: false,
        needsShopSetup: !user?.shop
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Invalid credentials', 
        isLoading: false 
      });
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await result.user.getIdToken();
      
      // Enviar el token de Firebase al backend
      const apiUrl = `${process.env.REACT_APP_API_URL_DEV}/auth/firebase/verify-token`;
      console.log('Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: idToken,
          userData: {
            fullName: data.fullName
          }
        }),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }
      
      if (!responseData.success || !responseData.data) {
        console.error('Estructura de respuesta inesperada:', responseData);
        throw new Error('Respuesta inválida del servidor');
      }
      
      const { token, user } = responseData.data;
      
      setStorageItem('token', token);
      set({
        isAuthenticated: true,
        token,
        user,
        isLoading: false,
        needsShopSetup: !user?.shop
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed', 
        isLoading: false 
      });
    }
  },

  createShop: async (data: CreateShopData) => {
    const currentUser = get().user;
    set({ isLoading: true, error: null });
    try {
      const token = getStorageItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const apiUrl = `${process.env.REACT_APP_API_URL_DEV}/shops`;
      console.log('Sending request to:', apiUrl);
      console.log('Data being sent:', data);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create shop');
      }
      const updatedUser = responseData.data;
      set({ user: updatedUser, isLoading: false, needsShopSetup: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create shop', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    removeStorageItem('token');
    set({ token: null, isAuthenticated: false, user: null, needsShopSetup: false });
  },

  clearError: () => {
    set({ error: null });
  },

  setToken: (token: string) => {
    setStorageItem('token', token);
    set({ token, isAuthenticated: true });
  },

  clearToken: () => {
    removeStorageItem('token');
    set({ token: null, isAuthenticated: false });
  }
}));
