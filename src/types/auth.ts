export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'user' | 'admin'; // MT-30: Optional role selection for login
}

export interface RegisterData extends LoginCredentials {
  confirmPassword: string;
  fullName?: string;
  birthDate?: string;
  city?: string;
  province?: string;
  country?: string;
  token?: string;
}

export interface CreateShopData {
  shopName: string;
  category: string;
  address: string;
  brandName: string;
  contactEmail: string;
  shopPhone: string;
  image?: File;
}

export interface Shop {
  _id: string;
  name: string;
  description?: string;
  mission?: string;
  vision?: string;
  history?: string;
  values?: string;
  subdomain: string;
  template: string;
  category: string;
  address: string;
  brandName: string;
  contactEmail: string;
  shopPhone: string;
  taxAdress: string;
  preferredCurrency: string;
  languageMain: string;
  country?: string;
  province?: string;
  city?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  
  imageUrl?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  active?: boolean; 
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  birthDate?: string;
  city?: string;
  province?: string;
  country?: string;
  shop?: Shop;
  role?: 'user' | 'admin';
  isActivated?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authMethod?: 'email' | 'google';
  isInfluencer?: boolean;
  imageUrl?: string;
  userType?: string[];
}

export interface UserWithLoading extends User {
  loading?: boolean;
}

export interface AuthState {
  user: UserWithLoading | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  currentUserMode: string | null;
}

export type AuthStore = AuthState & {
  loadProfile: () => Promise<User | null>;
  forceLoadProfile: () => Promise<User | null>;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  createShop: (data: CreateShopData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setUser: (user: UserWithLoading | null) => void;
  createProduct: (
    data: {
      nombre: string;
      descripcion: string;
      sku: string;
      estado: string;
      precio: string;
      categoria: string;
      stock: string;
      subcategoria: string;
      variantes?: { tipo: string; valores: string[] }[];
    } | FormData
  ) => Promise<any>;
  fetchProducts: () => Promise<any[]>;
  fetchActiveProducts: () => Promise<any[]>;
  /**
   * Obtiene todos los productos de todas las tiendas (para búsqueda global).
   */
  fetchAllProducts: () => Promise<any[]>;
  /**
   * Obtiene productos activos de una tienda específica (público).
   */
  fetchProductsByShop: (shopId: string) => Promise<any[]>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, data: {
    nombre?: string;
    sku?: string;
    descripcion?: string;
    precio?: string;
    stock?: string;
    categoria?: string;
    estado?: string;
    variantes?: { tipo: string; valores: string[] }[];
    
  }) => Promise<any>;
  fetchProductById: (id: string) => Promise<any>;
  setCurrentUserMode: (mode: string) => void;
  getCurrentUserMode: () => string | null;
}
