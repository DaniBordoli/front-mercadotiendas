import { create } from 'zustand';
import { FirstLayoutEditableVariables } from '../components/organisms/CustomizableMenu/types';

const LOCAL_STORAGE_KEY = 'firstLayoutEditableVariables';

const defaultEditableVariables: FirstLayoutEditableVariables = {
  navbarLinks: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop-layout' },
    { label: 'Contact', href: '/contact-layout' },
  ],
  title: 'ShopSmart',
  fontType: 'Arial',
  placeholderHeroImage: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=2141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  placeholderCardImage: 'https://placehold.co/300x400',
  textColor: '#000000',
  navbarBackgroundColor: '#FFFFFF',
  mainBackgroundColor: '#F8F9FA',
  filterOptions: {
    categories: [],
    prices: [],
    sorting: [],
  },
  footerBackgroundColor: '#0B1120',
  footerTextColor: '#FFFFFF',
  footerSections: [],
  footerDescription: 'Your one-stop destination for fashion and accessories.',
  searchTitle: 'Discover Your Style',
  buttonBackgroundColor: '#007BFF',
  buttonTextColor: '#FFFFFF',
  buttonBorderColor: '#0056b3',
  buttonText: 'Shop Now',
  button2Text: 'Learn More',
  button2BackgroundColor: '#FFFFFF',
  button2TextColor: '#1F2937',
  heroBackgroundColor: '#F9FAFB',
  featuredProductsTitle: 'Featured Products',
  categorySectionTitle: 'Shop by Category',
  primaryColor: '#007BFF',
  secondaryColor: '#93C5FD',
  footerElements: [],
  heroDescription: 'Shop the latest trends in fashion, accessories, and lifestyle products.',
  featuredProductsCardButtonText: 'Add to Cart',
  featuredProductsCardButtonColor: '#3B82F6',
  featuredProductsCardButtonTextColor: '#FFFFFF',
};

interface FirstLayoutStore {
  editableVariables: FirstLayoutEditableVariables;
  setEditableVariables: (vars: FirstLayoutEditableVariables) => void;
  updateEditableVariables: (changes: Partial<FirstLayoutEditableVariables>) => void;
}

export const useFirstLayoutStore = create<FirstLayoutStore>((set, get) => {
  // Load from localStorage if available
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  const initial = saved ? JSON.parse(saved) : defaultEditableVariables;

  return {
    editableVariables: initial,
    setEditableVariables: (vars) => {
      set({ editableVariables: vars });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vars));
    },
    updateEditableVariables: (changes) => {
      set((state) => {
        const updated = {
          ...state.editableVariables,
          ...changes,
          filterOptions: changes.filterOptions
            ? { ...state.editableVariables.filterOptions, ...changes.filterOptions }
            : state.editableVariables.filterOptions,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return { editableVariables: updated };
      });
    },
  };
});
