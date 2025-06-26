export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  confirmPassword: string;
  fullName: string;
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
  
  imageUrl?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
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
}

export type AuthStore = AuthState & {
  loadProfile: () => Promise<User | null>;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  createShop: (data: CreateShopData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
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
  /**
   * Obtiene todos los productos de todas las tiendas (para búsqueda global).
   */
  fetchAllProducts: () => Promise<any[]>;
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
}
