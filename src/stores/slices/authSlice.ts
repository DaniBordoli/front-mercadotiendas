import { create } from 'zustand';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';
import { LoginCredentials, RegisterData, CreateShopData, User, AuthState, AuthStore, UserWithLoading } from '../../types/auth';
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
import { authFetch } from '../../utils/authFetch';

// Función auxiliar para determinar si un usuario se logueó con Google
export const isGoogleUser = (user: User | UserWithLoading | null): boolean => {
  return user?.authMethod === 'google';
};

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
  console.log('[Auth] Obteniendo perfil de usuario desde:', apiUrl);
  
  const token = getStorageItem('token');

  if (!token) {
    console.error('[Auth] No se proporcionó token para obtener el perfil');
    throw new Error('No token provided');
  }

  try {

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    
    if (!response.ok) {

      // Incluir el código de estado en el mensaje de error para poder identificar errores 401
      throw new Error(`${response.status}: ${responseData.message || 'Error fetching user profile'}`);
    }

    if (!responseData.data || !responseData.data.user) {

      throw new Error('Invalid response structure');
    }


    return responseData.data.user;
  } catch (error) {

    throw error;
  }
};

export const updateUserProfile = async (profileData: Record<string, string | string[]>): Promise<void> => {
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

// Refuerzo: Esta función es CRÍTICA para la persistencia de sesión tras reload/retorno externo
const checkInitialAuthState = () => {
  // Siempre lee el token y el usuario desde localStorage
  const token = getStorageItem('token');
  const userStr = getStorageItem('user');
  let user: UserWithLoading | null = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
      if (!user || !user.email) {
        user = null;
      }
    } catch (e) {
      removeStorageItem('user');
      user = null;
    }
  }

  // isAuthenticated SIEMPRE false tras reload, solo se marca true tras validación backend
  return {
    token: token || null,
    user: user || null,
    isAuthenticated: false,
    error: null,
    loading: false,
  };
};

// Estado inicial SIEMPRE derivado de checkInitialAuthState
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
  // Estado para el modo actual del usuario
  currentUserMode: null as string | null,
  
  // Función para establecer el modo actual del usuario
  setCurrentUserMode: (mode: string) => {
    set({ currentUserMode: mode });
    setStorageItem('currentUserMode', mode);
  },
  
  // Función para obtener el modo actual del usuario
  getCurrentUserMode: () => {
    const { currentUserMode, user } = get();
    
    // Si ya hay un modo establecido, devolverlo
    if (currentUserMode) {
      return currentUserMode;
    }
    
    // Si no hay modo establecido, intentar obtenerlo del localStorage
    const storedMode = getStorageItem('currentUserMode');
    if (storedMode && user?.userType?.includes(storedMode)) {
      set({ currentUserMode: storedMode });
      return storedMode;
    }
    
    // Si no hay modo almacenado o no es válido, usar el primer tipo de usuario disponible
    if (user?.userType && user.userType.length > 0) {
      const defaultMode = user.userType[0];
      set({ currentUserMode: defaultMode });
      setStorageItem('currentUserMode', defaultMode);
      return defaultMode;
    }
    
    return null;
  },
  
  loadProfile: async () => {
    const token = get().token;
    console.log('[Auth] loadProfile llamado (posible origen: PaymentReturn). Token en store:', token);
    if (!token) {
      console.log('[Auth] No hay token disponible, no se puede cargar el perfil');
      return;
    }
    try {
      console.log('[Auth] Intentando cargar perfil desde el servidor...');
      const currentUser = get().user;
      if (currentUser) {
        set({ user: { ...currentUser, loading: true } });
      }
      // Log antes de llamar a fetchUserProfile
      console.log('[Auth] fetchUserProfile se llamará con token:', get().token);
      const user = await fetchUserProfile();
      if (!user || !user.email) throw new Error('Perfil inválido');
      const userWithAuthMethod = { ...user, loading: false };
      set({ user: userWithAuthMethod, isAuthenticated: true });
      console.log('[Auth] Perfil cargado exitosamente, sesión rehidratada.');
      return userWithAuthMethod;
    } catch (error) {
      set({ isAuthenticated: false });
      console.error('[Auth] Error al cargar perfil en loadProfile:', error);
      get().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
  },

  forceLoadProfile: async () => {
    const token = get().token;
    console.log('[Auth] forceLoadProfile - forzando recarga del perfil');
    
    if (!token) {
      console.log('[Auth] No hay token disponible para forzar recarga');
      return null;
    }

    try {
     
      const user = await fetchUserProfile();
      
      if (!user || !user.email) {
        throw new Error('Datos de usuario incompletos');
      }
      
      // Preservar el método de autenticación
      const currentUser = get().user;
      const userWithAuthMethod = {
        ...user,
        authMethod: currentUser?.authMethod || user.authMethod || 'email'
      };
      
      // Guardar y actualizar estado
      setStorageItem('user', JSON.stringify(userWithAuthMethod));
      set({ 
        user: userWithAuthMethod, 
        isAuthenticated: true 
      });
      
      console.log('[Auth] Perfil recargado exitosamente');
      return userWithAuthMethod;
    } catch (error) {
      console.error('[Auth] Error al forzar recarga del perfil:', error);
      if (error instanceof Error && error.message.includes('401')) {
        get().logout();
      }
      return null;
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

      // Marcar que el usuario se logueó con Google
      const userWithAuthMethod = {
        ...user,
        authMethod: 'google'
      };
  
      setStorageItem('token', token); 
      setStorageItem('user', JSON.stringify(userWithAuthMethod));
      set({
        isAuthenticated: true,
        token,
        user: userWithAuthMethod,
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
      
      const { accessToken, refreshToken, user } = responseData.data;
      
      // MT-30: Validate user role if specified
      if (credentials.role && user.role !== credentials.role) {
        throw new Error(`Acceso denegado. Este usuario no tiene permisos de ${credentials.role === 'admin' ? 'administrador' : 'usuario'}.`);
      }
      
      const isActivated = user?.isActivated === true;
      
      if (isActivated) {
        setStorageItem('token', accessToken);
        setStorageItem('refreshToken', refreshToken);
        set({
          isAuthenticated: true,
          token: accessToken,
          isLoading: false,
        });
        
        // Cargar el perfil actualizado incluyendo la tienda
        await get().loadProfile();
      } else {
        const userWithAuthMethod = {
          ...user,
          authMethod: 'email'
        };
        setStorageItem('token', accessToken);
        setStorageItem('refreshToken', refreshToken);
        setStorageItem('user', JSON.stringify(userWithAuthMethod));
        set({
          isAuthenticated: false,
          token: accessToken,
          user: userWithAuthMethod,
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
            ...(data.fullName && { fullName: data.fullName }),
            ...(data.birthDate && { birthDate: data.birthDate }),
            ...(data.city && { city: data.city }),
            ...(data.province && { province: data.province }),
            ...(data.country && { country: data.country })
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
        isActivated: user.isActivated !== undefined ? user.isActivated : false,
        authMethod: 'email'
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

    
      let body;
      let headers: any = {
        'Authorization': `Bearer ${token}`,
      };

      if (data.image) {
       
        const formData = new FormData();
        
     
        Object.keys(data).forEach(key => {
          if (key !== 'image' && data[key as keyof CreateShopData] !== undefined) {
            formData.append(key, String(data[key as keyof CreateShopData]));
          }
        });
        
     
        formData.append('image', data.image);
        
        body = formData;
        
      } else {
       
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
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
   * Obtiene la lista de productos del usuario autenticado (todos, incluye inactivos).
   * Usado para el panel de administración.
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
   * Obtiene solo los productos activos del usuario autenticado.
   * Usado para mostrar productos en la tienda.
   */
  fetchActiveProducts: async (): Promise<any[]> => {
    const token = getStorageItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const apiUrl = `${API_URL}/products/active`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend fetchActiveProducts:', responseData);
      throw new Error(responseData.message || 'Error al obtener los productos activos');
    }
   
    return responseData.data || [];
  },

  /**
   * Obtiene todos los productos de todas las tiendas (para búsqueda global).
   */
  fetchAllProducts: async (): Promise<any[]> => {
    const apiUrl = `${API_URL}/products/all`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend fetchAllProducts:', responseData);
      throw new Error(responseData.message || 'Error al obtener todos los productos');
    }
    return responseData.data || [];
  },

  /**
   * Obtiene los productos activos de una tienda específica (endpoint público).
   * Usado para mostrar productos cuando se visita la tienda de otro usuario.
   */
  fetchProductsByShop: async (shopId: string): Promise<any[]> => {
    const apiUrl = `${API_URL}/products/shop/${shopId}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error backend fetchProductsByShop:', responseData);
      throw new Error(responseData.message || 'Error al obtener los productos de la tienda');
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
      variantes?: { tipo: string; valores: string[] }[];
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

  setUser: (user: UserWithLoading | null) => {
    set({ user });
    if (user) {
      setStorageItem('user', JSON.stringify(user));
    } else {
      removeStorageItem('user');
    }
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

// Actualiza una categoría por ID
export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; status?: string; image?: string; parent?: string }
): Promise<any> => {
  const token = getStorageItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message || 'Error al actualizar la categoría');
  return responseData.data;
};

// --- SHOP SOCIAL MEDIA ENDPOINTS ---
export interface ShopSocial {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  horarios?: string;
  emailAlternativo?: string;
  telefonoAdicional?: string;
}

export const getShopSocial = async (shopId: string): Promise<ShopSocial | null> => {
  const token = getStorageItem('token');
  if (!token) throw new Error('No token provided');
  const response = await fetch(`${API_URL}/shopsocial/${shopId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 404) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener redes sociales');
  return data;
};

export const updateShopSocial = async (shopId: string, socialData: ShopSocial): Promise<ShopSocial> => {
  const token = getStorageItem('token');
  if (!token) throw new Error('No token provided');
  const response = await fetch(`${API_URL}/shopsocial/${shopId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(socialData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al actualizar redes sociales');
  return data;
};

// --- CURRENCY ENDPOINTS ---
export interface Currency {
  id: string;
  name: string;
  symbol: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchCurrencies = async (): Promise<Currency[]> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const response = await fetch(`${API_URL}/currencies`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener monedas');
  }
  
  return data.data;
};

export const createCurrency = async (currencyData: {
  name: string;
  symbol: string;
  code: string;
}): Promise<Currency> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const response = await fetch(`${API_URL}/currencies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(currencyData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al crear moneda');
  }
  
  return data.data;
};

export const updateCurrency = async (
  id: string,
  currencyData: { name?: string; symbol?: string; code?: string }
): Promise<Currency> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const response = await fetch(`${API_URL}/currencies/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(currencyData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar moneda');
  }
  
  return data.data;
};

export const deleteCurrency = async (id: string): Promise<void> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const response = await fetch(`${API_URL}/currencies/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar moneda');
  }
};

// --- CATEGORY HELPER FUNCTIONS ---
export const fetchMainCategories = async (): Promise<any[]> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener categorías');
  }
  
  // Filtrar solo categorías principales (sin parent)
  return data.data.filter((category: any) => !category.parent);
};

export const fetchSubcategoriesByParent = async (parentId: string): Promise<any[]> => {
  const token = getStorageItem('token');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener categorías');
  }
  
  // Filtrar solo subcategorías que pertenecen al parent especificado
  return data.data.filter((category: any) => category.parent === parentId);
};
