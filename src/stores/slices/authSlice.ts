import { create } from 'zustand';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';
import { LoginCredentials, RegisterData, CreateShopData, User, AuthState, AuthStore } from '../../types/auth';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  UserCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
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
  try {
    // 1. Verificar el token y obtener el email asociado
    const verifyUrl = `${API_URL}/auth/verify-reset-token/${token}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const responseData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      throw new Error(responseData.message || 'Token inválido');
    }

    if (!responseData.data?.email) {
      throw new Error('No se pudo obtener el email del usuario');
    }

    const { email } = responseData.data;

    // 2. Enviar email de reset a Firebase y actualizar en el backend
    try {
      // Primero enviamos el email de reset de Firebase
      await sendPasswordResetEmail(auth, email);
      
      // Luego actualizamos en el backend
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

      // Informar al usuario que debe usar el enlace de Firebase
      return Promise.reject(new Error('Se ha enviado un correo de Firebase para completar el cambio de contraseña. Por favor, revise su bandeja de entrada.'));
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Error al enviar el correo de restablecimiento de Firebase: ${error.message}`);
      }
      throw error;
    }

  } catch (error) {
    throw error instanceof Error ? error : new Error('Error desconocido al restablecer la contraseña');
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

export const updateAvatar = async (avatarFile: File): Promise<void> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  const response = await fetch(`${API_URL}/users/avatar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el avatar');
  }
};

export const updateProductImage = async (productId: string, imageFile: File): Promise<string> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  const formData = new FormData();
  formData.append('productImage', imageFile); 

  const response = await fetch(`${API_URL}/products/${productId}/image`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      
    },
    body: formData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Error al actualizar la imagen del producto');
  }
  
  return responseData.data.productImage;
};

/**
 * Sube una o varias imágenes al producto.
 */
export const addProductImages = async (productId: string, imageFiles: File[]): Promise<string[]> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  const formData = new FormData();
  imageFiles.forEach(file => {
    formData.append('productImages', file); // backend espera 'productImages'
  });

  const response = await fetch(`${API_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Error al subir imágenes del producto');
  }
  // Devuelve el array actualizado de URLs de imágenes
  return responseData.data.productImages;
};

/**
 * Elimina una imagen específica del producto.
 */
export const deleteProductImage = async (productId: string, imageUrl: string): Promise<string[]> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  const response = await fetch(`${API_URL}/products/${productId}/images`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Error al eliminar la imagen del producto');
  }
  // Devuelve el array actualizado de URLs de imágenes
  return responseData.data.productImages;
};

const checkInitialAuthState = () => {
  const token = getStorageItem('token');
  const userStr = getStorageItem('user'); // Keep reading user for potential initial display
  let user = null;

  // Try to parse user if it exists, but don't rely on it for isAuthenticated
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Error al parsear usuario almacenado:', e);
      // If user data is corrupted, remove it, but token might still be valid
      removeStorageItem('user');
    }
  }

  // If a token exists, assume the user is authenticated initially.
  // loadProfile will verify the token and fetch actual user data/status.
  if (token) {
    return { token, isAuthenticated: true, user }; // Set isAuthenticated based on token presence
  }

  // No token means not authenticated
  return { token: null, isAuthenticated: false, user: null };
};

const initialState = checkInitialAuthState();

let logoutTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Inicia un temporizador para desloguear al usuario después de `timeoutMs` milisegundos.
 * Si ya existe un temporizador, lo reinicia.
 * @param timeoutMs Tiempo en milisegundos antes de desloguear (por ejemplo, 30 minutos = 1800000)
 */
export const startAutoLogoutTimer = (timeoutMs: number, logoutCallback: () => void) => {
  clearAutoLogoutTimer();
  logoutTimer = setTimeout(() => {
    logoutCallback();
  }, timeoutMs);
};

/**
 * Limpia el temporizador de auto-logout si existe.
 */
export const clearAutoLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}

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
      console.log('[Auth] Iniciando proceso de login con email...');
      console.log('[Auth] API_URL:', API_URL);

      const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      console.log('[Auth] Firebase login exitoso, obteniendo token...');
      const idToken = await result.user.getIdToken();
      console.log('[Auth] Token obtenido correctamente');
      
      const apiUrl = `${API_URL}/auth/authenticate`;
      console.log('[Auth] Intentando autenticar en backend:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      }).catch(error => {
        console.error('[Auth] Error en fetch:', error);
        throw error;
      });
      
      console.log('[Auth] Respuesta del backend recibida, status:', response.status);
      const responseData = await response.json();
      console.log('[Auth] Datos de respuesta:', responseData);

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

  /**
   * 
   * @param data Los datos del producto a crear.
   */
  createProduct: async (
    data: any // Puede ser FormData o un objeto normal
  ): Promise<any> => {
    set({ isLoading: true, error: null });
    try {
      const token = getStorageItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const apiUrl = `${API_URL}/products`;
      let response;
      if (data instanceof FormData) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // No poner 'Content-Type' aquí
          },
          body: data,
        });
      } else {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      }
      const responseData = await response.json();
      if (!response.ok) {
        console.error('Error backend createProduct:', responseData);
        throw new Error(responseData.message || 'Error al crear el producto');
      }
      set({ isLoading: false });
      return responseData;
    } catch (error) {
      console.error('Error en createProduct:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al crear el producto',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Obtiene la lista de productos del usuario autenticado.
   */
  fetchProducts: async (): Promise<any[]> => {
    const token = getStorageItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const apiUrl = `${API_URL}/products`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend fetchProducts:', responseData);
      throw new Error(responseData.message || 'Error al obtener los productos');
    }
   
    return responseData.data || [];
  },

  /**
   * Elimina un producto por su ID.
   */
  deleteProduct: async (id: string): Promise<void> => {
    const token = getStorageItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const apiUrl = `${API_URL}/products/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend deleteProduct:', responseData);
      throw new Error(responseData.message || 'Error al eliminar el producto');
    }
    
  },

  updateProduct: async (
    id: string,
    data: {
      nombre?: string;
      sku?: string;
      descripcion?: string;
      precio?: string;
      stock?: string;
      categoria?: string;
      estado?: string;
    }
  ): Promise<any> => {
    const token = getStorageItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const apiUrl = `${API_URL}/products/${id}`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend updateProduct:', responseData);
      throw new Error(responseData.message || 'Error al actualizar el producto');
    }
    return responseData.data;
  },

  fetchProductById: async (id: string): Promise<any> => {
    const token = getStorageItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const apiUrl = `${API_URL}/products/${id}`;
    console.log('fetchProductById URL:', apiUrl, 'id:', id);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend fetchProductById:', responseData);
      throw new Error(responseData.message || 'Error al obtener el producto');
    }
    return responseData.data;
  },

  logout: () => {
    removeStorageItem('token');
    removeStorageItem('user');
    set({ token: null, isAuthenticated: false, user: null });
    clearAutoLogoutTimer();
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
  },

  /**
   * Llama a este método para iniciar el temporizador de auto-logout.
   * Por ejemplo: useAuthStore.getState().startAutoLogout()
   * El tiempo por defecto es 30 minutos (1800000 ms).
   */
  startAutoLogout: (timeoutMs: number = 1800000) => {
    startAutoLogoutTimer(timeoutMs, () => {
      get().logout();
    });
  },

  /**
   * Llama a este método para limpiar el temporizador de auto-logout.
   */
  clearAutoLogout: () => {
    clearAutoLogoutTimer();
  },
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


export const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string;
  status?: 'Active' | 'Pending' | 'Inactive';
  parent?: string | null;
}) => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
 
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Error al crear la categoría');
  }
  return responseData.data;
};


export const fetchCategories = async () => {
  const token = getStorageItem('token');
  if (!token) throw new Error('No token provided');
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message || 'Error al obtener categorías');
  return responseData.data;
};


export const deleteCategory = async (id: string) => {
  const token = getStorageItem('token');
  if (!token) throw new Error('No token provided');
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message || 'Error al eliminar la categoría');
  return responseData.data;
};
