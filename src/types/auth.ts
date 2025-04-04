export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  confirmPassword: string;
  fullName: string;
  token?: string;
}

export interface CreateShopData {
  shopName: string;
  category: string;
  address: string;
}

export interface Shop {
  name: string;
  category: string;
  address: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  shop?: Shop;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  needsShopSetup: boolean;
}

export type AuthStore = AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  createShop: (data: CreateShopData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}
