import { create } from 'zustand';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';
import { LoginCredentials, RegisterData, CreateShopData, User, AuthState, AuthStore } from '../../types/auth';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { API_URL } from '../../services/api';

export const forgotPassword = async (email: string): Promise<void> => {
  const apiUrl = `${API_URL}/auth/forgot-password`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al enviar el correo.');
  }
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  const apiUrl = `${API_URL}/auth/reset-password/${token}`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al restablecer la contraseña');
  }
};

export const fetchUserProfile = async () => {
  const apiUrl = `${API_URL}/users/profile`;
  const token = getStorageItem('token'); // Retrieve the token from storage

  if (!token) {
    console.error('No token provided');
    throw new Error('No token provided');
  }

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
    },
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Error fetching user profile');
  }

  return responseData.data.user; // Return the user data
};

const checkInitialAuthState = () => {
  const token = getStorageItem('token');
  const userStr = getStorageItem('user');
  let isAuthenticated = false;
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      isAuthenticated = !!user.isActivated;
      
      if (!isAuthenticated) {
        removeStorageItem('token');
      }
    } catch (e) {
      console.error('Error al parsear usuario almacenado:', e);
      removeStorageItem('token');
      removeStorageItem('user');
    }
  }
  
  return { token: isAuthenticated ? token : null, isAuthenticated };
};

const initialState = checkInitialAuthState();

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: initialState.isAuthenticated,
  isLoading: false,
  error: null,
  token: initialState.token,


  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const apiUrl = `${API_URL}/auth/authenticate`;
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
      const isActivated = user?.isActivated === true;
      
      if (isActivated) {
        setStorageItem('token', token);
        setStorageItem('user', JSON.stringify(user));
        set({
          isAuthenticated: true,
          token,
          user,
          isLoading: false,

        });
      } else {
        setStorageItem('token', token);
        setStorageItem('user', JSON.stringify(user));
        set({
          isAuthenticated: false,
          token,
          user,
          isLoading: false,

        });
        
        window.location.href = `/activate-account?email=${encodeURIComponent(user.email)}`;
      }
      

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
      
  
      const apiUrl = `${API_URL}/auth/authenticate`;
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
      
      const isActivated = user?.isActivated === true;
      
      if (isActivated) {
        setStorageItem('token', token);
        setStorageItem('user', JSON.stringify(user));
        set({
          isAuthenticated: true,
          token,
          user,
          isLoading: false,

        });
      } else {
        setStorageItem('token', token);
        setStorageItem('user', JSON.stringify(user));
        set({
          isAuthenticated: false,
          token,
          user,
          isLoading: false,

        });
        
        window.location.href = `/activate-account?email=${encodeURIComponent(user.email)}`;
      }
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
      
  
      const apiUrl = `${API_URL}/auth/authenticate`;
      console.log('Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: idToken,
          userData: {
            fullName: data.fullName,
            birthDate: data.birthDate,
            city: data.city,
            province: data.province,
            country: data.country
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
      
      const userWithActivation = {
        ...user,
        isActivated: user.isActivated !== undefined ? user.isActivated : false
      };
      
      setStorageItem('token', token);
      setStorageItem('user', JSON.stringify(userWithActivation));
      
      set({
        isAuthenticated: false,
        token,
        user: userWithActivation,
        isLoading: false,

      });
      
      return userWithActivation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed', 
        isLoading: false 
      });
      throw error; // Re-lanzamos el error para manejarlo en el componente
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
      
      const apiUrl = `${API_URL}/shops`;
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
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create shop', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    removeStorageItem('token');
    removeStorageItem('user');
    set({ token: null, isAuthenticated: false, user: null });
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
    removeStorageItem('user');
    set({ token: null, isAuthenticated: false });
  }
}));
