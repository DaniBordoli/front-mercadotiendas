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

export const updateUserProfile = async (profileData: Record<string, string>): Promise<void> => {
  const apiUrl = `${API_URL}/users/profile`;
  const token = getStorageItem('token');

  if (!token) {
    console.error('No token provided');
    throw new Error('No token provided');
  }

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error updating user profile');
  }

  const responseData = await response.json();

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
  
  if (!isAuthenticated || !token) {
    return { token: null, isAuthenticated: false, user: null };
  }

  // Intentar obtener el usuario del storage
  try {
    const user = JSON.parse(userStr || '{}');
    return { token, isAuthenticated: true, user };
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    removeStorageItem('token');
    removeStorageItem('user');
    return { token: null, isAuthenticated: false, user: null };
  }
};

const initialState = checkInitialAuthState();

export const useAuthStore = create<AuthStore>((set, get) => ({
  loadProfile: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const user = await fetchUserProfile();
      setStorageItem('user', JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Error loading profile:', error);
      get().logout();
    }
  },

  user: null,
  isAuthenticated: initialState.isAuthenticated,
  isLoading: false,
  error: null,
  token: initialState.token,


  loginWithGoogle: async () => {
    const store = get();

    set({ isLoading: true, error: null });
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const apiUrl = `${API_URL}/auth/authenticate`;

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
      
      const needsProfileCompletion = isActivated && 
        (!user.country || !user.city || !user.birthDate || !user.province);
  
      setStorageItem('token', token); 
      setStorageItem('user', JSON.stringify(user));
      set({
        isAuthenticated: true,
        token,
        user,
        isLoading: false,
      });

      if (needsProfileCompletion) {
        window.location.href = '/complete-profile'; 
      } else {
        await get().loadProfile();
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
        set({
          isAuthenticated: true,
          token,
          isLoading: false,
        });
        
        // Cargar el perfil actualizado incluyendo la tienda
        await get().loadProfile();
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

export const fetchProvincesForArgentina = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    const argentina = countries.find((country: any) => country.name.common === 'Argentina');
    if (argentina) {
     
      return [
        'Buenos Aires',
        'Córdoba',
        'Santa Fe',
        'Mendoza',
        'Tucumán',
        'Salta',
        'Entre Ríos',
        'Misiones',
        'Chaco',
        'Corrientes',
        'Santiago del Estero',
        'San Juan',
        'Jujuy',
        'Río Negro',
        'Neuquén',
        'Formosa',
        'Chubut',
        'San Luis',
        'Catamarca',
        'La Rioja',
        'La Pampa',
        'Santa Cruz',
        'Tierra del Fuego',
      ];
    }
    throw new Error('Argentina not found in the API response');
  } catch (error) {
    console.error('Error fetching provinces for Argentina:', error);
    throw error;
  }
};

export const fetchCountries = async (): Promise<{ name: string; code: string }[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    const argentina = data.filter((country: any) => country.name.common === 'Argentina');
    return argentina.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};
