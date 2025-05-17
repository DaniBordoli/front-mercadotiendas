import { create } from 'zustand';

// --- Tipos Compartidos ---
// Idealmente, estos tipos vendrían de un paquete compartido con el backend

interface Suggestion {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[]; 
  rating?: number;
  storeName?: string; 
  brand?: string; 
  condition: 'new' | 'used'; 
  hasFreeShipping?: boolean; 
  isFeatured?: boolean; 
}

// --- NUEVO: Tipo para Opiniones ---
export interface Review {
    id: string;
    productId: string;
    userId: string; // Podría ser un ID o nombre
    userName: string; // Nombre a mostrar
    rating: number; // 1 a 5
    text: string;
    createdAt: string; // Fecha en formato ISO string para simplicidad
}

export type SortOrder = 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc';

interface PriceRange {
  min: number | null;
  max: number | null;
}

// Estructura simulada de los filtros disponibles 
// Calculada a partir de los resultados filtrados por término
interface AvailableFilters {
  brands: string[];
  conditions: ('new' | 'used')[];
  priceRange: { // Rango de precios de *todos* los resultados para el query
    min: number;
    max: number;
  };
  // ... otros filtros que la API pueda devolver
}

// --- Mock Data ---
// Reintroducidos para uso local temporal
const mockSuggestions: Suggestion[] = [
  { id: 'p1', name: 'Laptop Gamer XYZ' },
  { id: 'p2', name: 'Teclado Mecánico RGB' },
  { id: 'p3', name: 'Monitor Curvo 34"' },
  { id: 't1', name: 'Ofertas de Verano' },
  { id: 'c1', name: 'Electrónicos' },
];

const mockProducts: Product[] = [
   {
    id: 'prod1',
    name: 'Laptop Gamer Super potente con RTX 4090 y 128GB RAM Edición Limitada',
    price: 1599,
    imageUrls: [
      'https://http2.mlstatic.com/D_NQ_NP_635374-MLA80071215010_102024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_600213-MLA80326590263_102024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_808325-MLA80326540717_102024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_957892-MLA80071215044_102024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_931457-MLA80071215054_102024-O.webp',
    ],
    rating: 4.8,
    storeName: 'Tienda Oficial GamerTech',
    brand: 'GamerTech',
    condition: 'new',
    hasFreeShipping: true,
    isFeatured: true,
  },
  {
    id: 'prod2',
    name: 'Laptop Oficina Ligera 14 pulgadas Intel i5 16GB RAM',
    price: 799,
    imageUrls: [
      'https://http2.mlstatic.com/D_NQ_NP_871099-MLU78492932098_082024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_774805-MLU78492932106_082024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_779486-MLU78724794259_082024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_843338-MLU78493100360_082024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_700574-MLU78492932132_082024-O.webp',
    ],
    rating: 4.2,
    storeName: 'PC Componentes',
    brand: 'Genérica',
    condition: 'used',
    hasFreeShipping: true,
    isFeatured: false,
  },
  {
    id: 'prod3',
    name: 'Teclado Mecánico Gamer RGB Retroiluminado',
    price: 119,
    imageUrls: [
      'https://placehold.co/200x200?text=Teclado_A',
      'https://placehold.co/200x200?text=Teclado_B',
      'https://placehold.co/200x200?text=Teclado_C',
      'https://placehold.co/200x200?text=Teclado_D',
      'https://placehold.co/200x200?text=Teclado_E',
    ],
    rating: 4.5,
    storeName: 'Accesorios Pro',
    brand: 'ProKeys',
    condition: 'new',
    hasFreeShipping: false,
    isFeatured: false,
  },
   {
    id: 'prod4',
    name: 'Monitor Curvo Ultrawide 34 pulgadas 144Hz',
    price: 450,
    imageUrls: [
      'https://http2.mlstatic.com/D_NQ_NP_624526-MLA82135931694_022025-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_906498-MLA53447913186_012023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_841236-MLA53447855383_012023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_617031-MLA82418699651_022025-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_724709-MLA82135893928_022025-O.webp',
    ],
    rating: 4.1, // Rating añadido
    storeName: 'Tienda Oficial Displays',
    brand: 'DisplaysHub',
    condition: 'new',
    hasFreeShipping: true,
    isFeatured: true,
  },
  // Añadir más productos mock para probar paginación y filtros
  {
    id: 'prod5',
    name: 'Mouse Inalámbrico Ergonómico',
    price: 45,
    imageUrls: ['https://placehold.co/200x200?text=Mouse1', 'https://placehold.co/200x200?text=Mouse2', 'https://placehold.co/200x200?text=Mouse3', 'https://placehold.co/200x200?text=Mouse4', 'https://placehold.co/200x200?text=Mouse5'],
    rating: 4.6,
    storeName: 'PC Componentes',
    brand: 'Logi',
    condition: 'new',
    hasFreeShipping: false,
    isFeatured: false,
  },
    {
    id: 'prod6',
    name: 'Teclado Apple Magic Keyboard Usado',
    price: 80,
    imageUrls: ['https://placehold.co/200x200?text=AppleKey1', 'https://placehold.co/200x200?text=AppleKey2', 'https://placehold.co/200x200?text=AppleKey3', 'https://placehold.co/200x200?text=AppleKey4', 'https://placehold.co/200x200?text=AppleKey5'],
    rating: 4.0,
    storeName: 'ReacondicionadosYa',
    brand: 'Apple',
    condition: 'used',
    hasFreeShipping: true,
    isFeatured: false,
  },
];

// --- NUEVO: Mock Data para Opiniones (Inicialmente Vacío) ---
const mockReviews: Review[] = []; // <--- Dejar este array vacío

// --- Helper Functions (Reintroducidas y adaptadas) ---

const applyFilters = (products: Product[], filters: {
  selectedBrands: string[];
  selectedCondition: 'new' | 'used' | null;
  priceRange: PriceRange;
}): Product[] => {
  let filtered = products;

  if (filters.selectedCondition) {
    filtered = filtered.filter(p => p.condition === filters.selectedCondition);
  }
  if (filters.selectedBrands.length > 0) {
    // Asegurarse que el producto tenga marca antes de incluir
    filtered = filtered.filter(p => p.brand && filters.selectedBrands.includes(p.brand));
  }
  const { min, max } = filters.priceRange;
  if (min !== null) {
    filtered = filtered.filter(p => p.price >= min);
  }
  if (max !== null) {
    filtered = filtered.filter(p => p.price <= max);
  }
  return filtered;
};

const sortProducts = (products: Product[], order: SortOrder): Product[] => {
  // Crear una copia para no mutar el original
  const sorted = [...products]; 
  switch (order) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating_desc':
      // Poner productos sin rating al final
      return sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    case 'relevance': // Relevancia simulada = orden después de filtrar por término
    default:
      return sorted; // Devuelve la copia (potencialmente ya ordenada por relevancia implícita)
  }
};

// Helper para calcular filtros disponibles desde un conjunto de productos
const calculateAvailableFilters = (products: Product[]): AvailableFilters => {
    const brands = Array.from(new Set(products.map(p => p.brand).filter((b): b is string => !!b)));
    const conditions = Array.from(new Set(products.map(p => p.condition))) as ('new' | 'used')[];
    
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    if (products.length > 0) {
        minPrice = Math.min(...products.map(p => p.price));
        maxPrice = Math.max(...products.map(p => p.price));
    } else {
        minPrice = 0; // Default si no hay productos
        maxPrice = 0;
    }

    return {
        brands: brands.sort(), // Ordenar alfabéticamente
        conditions: conditions.sort(), // Ordenar consistentemente
        priceRange: { min: minPrice, max: maxPrice }
    };
};


// --- Estado del Store ---

interface SearchState {
  // Búsqueda y Sugerencias
  searchTerm: string;
  suggestions: Suggestion[];
  isLoadingSuggestions: boolean;
  
  // Resultados (Estado Base y Mostrado)
  baseSearchResults: Product[]; // Resultados después de filtro por término
  searchResults: Product[];    // Productos de la página actual (filtrados, ordenados, paginados)
  isLoadingResults: boolean;

  // Producto Seleccionado (para página de detalle)
  selectedProduct: Product | null;
  isLoadingProduct: boolean;
  // --- NUEVO: Estado para Opiniones del Producto Seleccionado ---
  productReviews: Review[];
  isLoadingReviews: boolean;

  // Paginación (Simulada)
  totalResults: number;        // Total después de filtro por término
  currentPage: number;
  totalPages: number;
  itemsPerPage: number; // Podría ser configurable

  // Ordenamiento y Filtros
  sortOrder: SortOrder;
  availableFilters: AvailableFilters | null; // Filtros disponibles según baseSearchResults
  // --- Filtros Seleccionados por el Usuario ---
  selectedBrands: string[];
  selectedCondition: 'new' | 'used' | null;
  priceRange: PriceRange; // Filtro de precio aplicado por el usuario

  // --- Acciones ---
  setSearchTerm: (term: string) => void;
  fetchSuggestions: (term: string) => void; // Ya no es async
  clearSuggestions: () => void;
  
  // Búsqueda y Paginación (Simulada)
  fetchSearchResults: (options?: { term?: string; page?: number; keepFilters?: boolean }) => void; // Ya no es async
  goToPage: (pageNumber: number) => void;
  _updateDisplayedResults: () => void; // Helper interno

  // Ordenamiento y Filtrado
  setSortOrder: (order: SortOrder) => void;
  toggleBrandFilter: (brand: string) => void;
  setConditionFilter: (condition: 'new' | 'used' | null) => void;
  setPriceRange: (range: PriceRange) => void;
  clearFilters: () => void; 

  // Acciones para Producto Individual
  fetchProductById: (productId: string) => void; // Ya no es async
  clearSelectedProduct: () => void;
  // --- NUEVO: Acciones para Opiniones ---
  fetchReviewsByProductId: (productId: string) => void;
  addReview: (productId: string, reviewData: { rating: number; text: string }) => void;
}

// --- Implementación del Store ---

// ELIMINADO: const API_BASE_URL

export const useSearchStore = create<SearchState>((set, get) => ({
  // Estado inicial
  searchTerm: '',
  suggestions: [],
  isLoadingSuggestions: false,
  
  baseSearchResults: [], // Inicializar vacío
  searchResults: [],
  isLoadingResults: false,

  // Estado inicial para producto individual
  selectedProduct: null,
  isLoadingProduct: false,
  // --- NUEVO: Estado inicial para Opiniones ---
  productReviews: [],
  isLoadingReviews: false,

  totalResults: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 3, // Bajar para probar paginación con pocos mocks

  sortOrder: 'relevance',
  availableFilters: null, 
  selectedBrands: [],
  selectedCondition: null,
  priceRange: { min: null, max: null },

  // --- Acciones ---

  setSearchTerm: (term) => set({ searchTerm: term }),

  clearSuggestions: () => set({ suggestions: [] }),

  // Ahora síncrono y usa mocks
  fetchSuggestions: (term) => {
    if (!term.trim()) {
      set({ suggestions: [], isLoadingSuggestions: false });
      return;
    }
    set({ isLoadingSuggestions: true });
    // Simular pequeña demora
    setTimeout(() => {
      const filteredSuggestions = mockSuggestions.filter(s => 
        s.name.toLowerCase().includes(term.toLowerCase())
      );
      set({ suggestions: filteredSuggestions, isLoadingSuggestions: false });
    }, 150); 
  },

  // Helper interno para recalcular filtros, orden y paginación
  _updateDisplayedResults: () => {
      const { 
          baseSearchResults, selectedBrands, selectedCondition, priceRange, 
          sortOrder, currentPage, itemsPerPage 
      } = get();

      // 1. Aplicar filtros de usuario
      const userFiltered = applyFilters(baseSearchResults, { selectedBrands, selectedCondition, priceRange });

      // 2. Ordenar
      const sorted = sortProducts(userFiltered, sortOrder);

      // 3. Paginar
      const totalPages = Math.ceil(sorted.length / itemsPerPage);
      const pageIndex = currentPage - 1;
      const startIndex = pageIndex * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedResults = sorted.slice(startIndex, endIndex);

      set({
          searchResults: paginatedResults,
          totalPages: totalPages > 0 ? totalPages : 1, // Evitar 0 páginas
          // currentPage se mantiene como está
      });
  },

  // Ahora síncrono y usa mocks
  fetchSearchResults: (options = {}) => {
    const { 
        term = get().searchTerm, 
        page = 1,             
        keepFilters = false   
    } = options;

    if (!term.trim()) {
      set({ 
        searchTerm: '', baseSearchResults: [], searchResults: [], totalResults: 0, 
        currentPage: 1, totalPages: 1, availableFilters: null,
        selectedBrands: [], selectedCondition: null, priceRange: { min: null, max: null },
        isLoadingResults: false 
      });
      return;
    }

    set({ isLoadingResults: true, searchTerm: term }); // Actualizar término
    
    // Simular demora de búsqueda
    setTimeout(() => {
      // 1. Filtrar mocks por término
      const termFilteredResults = mockProducts.filter(p => 
          p.name.toLowerCase().includes(term.toLowerCase())
      );

      // 2. Calcular metadatos
      const totalResults = termFilteredResults.length;
      const availableFilters = calculateAvailableFilters(termFilteredResults);

      // 3. Resetear filtros seleccionados si es nueva búsqueda
      let newStatePartial: Partial<SearchState> = {
          baseSearchResults: termFilteredResults,
          totalResults: totalResults,
          availableFilters: availableFilters,
          currentPage: page, // Establecer página solicitada
          isLoadingResults: false,
      };
      if (!keepFilters) {
          newStatePartial = {
              ...newStatePartial,
              selectedBrands: [],
              selectedCondition: null,
              priceRange: { min: null, max: null },
              sortOrder: 'relevance' // Resetear orden también? Sí.
          };
      }
      
      set(newStatePartial);

      // 4. Calcular y mostrar resultados (filtrados, ordenados, paginados)
      get()._updateDisplayedResults(); 

    }, 300); // Simular delay
  },

  goToPage: (pageNumber) => {
    const { totalPages, currentPage } = get();
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      set({ currentPage: pageNumber }); // Actualiza página
      get()._updateDisplayedResults();   // Recalcula resultados para esa página
    }
  },

  // --- Acciones de Ordenamiento y Filtrado (ahora llaman a _updateDisplayedResults) ---
  setSortOrder: (order) => {
    set({ sortOrder: order, currentPage: 1 }); // Resetear a página 1
    get()._updateDisplayedResults();
  },

  toggleBrandFilter: (brand) => {
    const currentSelected = get().selectedBrands;
    const newSelected = currentSelected.includes(brand)
      ? currentSelected.filter(b => b !== brand)
      : [...currentSelected, brand];
    set({ selectedBrands: newSelected, currentPage: 1 }); // Resetear a página 1
    get()._updateDisplayedResults();
  },

  setConditionFilter: (condition) => {
    set({ selectedCondition: condition, currentPage: 1 }); // Resetear a página 1
    get()._updateDisplayedResults();
  },

  setPriceRange: (range) => {
    set({ priceRange: range, currentPage: 1 }); // Resetear a página 1
    get()._updateDisplayedResults();
  },

  clearFilters: () => {
    set({
      selectedBrands: [],
      selectedCondition: null,
      priceRange: { min: null, max: null },
      sortOrder: 'relevance', 
      currentPage: 1, // Resetear a página 1
    });
    get()._updateDisplayedResults(); 
  },

  // --- Acciones para Producto Individual ---
  
  // Ahora síncrono y usa mocks
  fetchProductById: (productId) => {
    if (!productId) {
      console.error("fetchProductById: productId es requerido.");
      // Limpiar producto y reviews si no hay ID
      set({ selectedProduct: null, isLoadingProduct: false, productReviews: [], isLoadingReviews: false }); 
      return;
    }
    // Iniciar carga y limpiar anterior producto y reviews
    set({ isLoadingProduct: true, selectedProduct: null, productReviews: [], isLoadingReviews: false }); 

    // Simular demora de búsqueda individual
    setTimeout(() => {
      // Usar mockProducts que ya está definido en el archivo
      const foundProduct = mockProducts.find(p => p.id === productId);

      if (foundProduct) {
        console.log(`[Store] Producto encontrado por ID ${productId}:`, foundProduct);
        set({ selectedProduct: { ...foundProduct }, isLoadingProduct: false }); // Guardar una copia
        // Ahora llamar a fetchReviewsByProductId después de encontrar el producto
        get().fetchReviewsByProductId(productId);
      } else {
        console.warn(`[Store] Producto con ID ${productId} no encontrado.`);
        set({ selectedProduct: null, isLoadingProduct: false }); // isLoadingReviews ya está en false
      }
    }, 200); // Simular delay más corto para carga individual
  },

  clearSelectedProduct: () => {
    // Asegurar que isLoadingProduct y reviews también se reseteen
    set({ selectedProduct: null, isLoadingProduct: false, productReviews: [], isLoadingReviews: false }); 
  },

  // --- NUEVO: Acciones para Opiniones ---
  fetchReviewsByProductId: (productId) => {
    set({ isLoadingReviews: true });
    console.log(`[Store] Buscando reviews para producto ID: ${productId}`);
    // Simular demora de fetch de reviews
    setTimeout(() => {
        // Ahora siempre empezará vacío ya que mockReviews está vacío
        const reviewsForProduct = mockReviews.filter(r => r.productId === productId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        console.log(`[Store] Reviews encontradas: ${reviewsForProduct.length}`); // Debería ser 0 inicialmente
        set({ productReviews: reviewsForProduct, isLoadingReviews: false });
    }, 150); // Delay corto simulado
  },

  addReview: (productId, reviewData) => {
    const { rating, text } = reviewData;
    const currentUser = { id: 'tempUser123', name: 'Usuario Actual' }; // Simular usuario logueado

    const newReview: Review = {
        id: `rev_${Date.now()}`,
        productId: productId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: rating,
        text: text,
        createdAt: new Date().toISOString(),
    };

    console.log('[Store] Añadiendo nueva review:', newReview);

    // Añadir la nueva review al principio de la lista existente
    set(state => ({
        productReviews: [newReview, ...state.productReviews]
    }));
    
    // Opcional: podrías querer recalcular el rating promedio del producto aquí también
    // const currentProduct = get().selectedProduct;
    // if (currentProduct) { ... recalcular y actualizar selectedProduct ... }
  },
}));
