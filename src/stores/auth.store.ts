import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthStore, LoginCredentials, RegisterData, CreateShopData } from '../types/auth';
import * as api from '../services/api';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  needsShopSetup: false,
};

export const useAuthStore = create<AuthStore>()((
  persist(
    (set, get) => ({
      ...initialState,

      token: localStorage.getItem('token'),

      setToken: (token: string) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
      },

      clearToken: () => {
        localStorage.removeItem('token');
        set({ token: null, isAuthenticated: false });
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const idToken = await result.user.getIdToken();
          const response = await api.loginWithGoogle(idToken);
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsShopSetup: !user.shop
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred during Google login',
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.login(credentials);
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsShopSetup: !user.shop
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred during login',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          // Primero crear el usuario en Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          const idToken = await userCredential.user.getIdToken();
          
          // Luego registrarlo en nuestro backend
          const response = await api.register({
            ...data,
            token: idToken
          });
          
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsShopSetup: !user.shop
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred during registration',
            isLoading: false,
          });
          throw error;
        }
      },

      createShop: async (data: CreateShopData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.createShop(data);
          const { user } = response.data;
          set({ user, isLoading: false, needsShopSetup: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred while creating shop',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set(initialState);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        needsShopSetup: state.needsShopSetup,
      }),
    }
  )
));
