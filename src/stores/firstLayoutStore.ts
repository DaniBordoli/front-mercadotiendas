import { create } from 'zustand';
import { FirstLayoutEditableVariables } from '../components/organisms/CustomizableMenu/types';

interface FirstLayoutStore {
  editableVariables: FirstLayoutEditableVariables;
  setEditableVariables: (vars: FirstLayoutEditableVariables) => void;
  updateEditableVariables: (changes: Partial<FirstLayoutEditableVariables>) => void;
}

// Valores por defecto mínimos para el template
const defaultEditableVariables: FirstLayoutEditableVariables = {
  navbarLinks: [
    { label: 'Inicio', href: '/first-layout' },
    { label: 'Tienda', href: '/first-layout/shop-layout' },
    { label: 'Contacto', href: '/first-layout/contact-layout' },
    { label: 'Acerca de', href: '/first-layout/aboutus-layout' },
  ],
  title: 'Mi Tienda',
  fontType: 'Arial',
  placeholderHeroImage: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=2141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  placeholderCardImage: '',
  textColor: '#000000',
  navbarBackgroundColor: '#FFFFFF',
  mainBackgroundColor: '#FFFFFF',
  filterOptions: {
    categories: [],
    prices: [],
    sorting: []
  },
  // Solo valores por defecto básicos - los colores reales vendrán del templateUpdate
  primaryColor: '#FF4F41',
  secondaryColor: '#4ECDC4',
  accentColor: '#F8F8F8',
  // Colores de texto específicos para páginas
  productPageTextColor: '#333333',
  aboutUsTextColor: '#333333',
  contactTextColor: '#333333',
  // Colores para footer
  footerTextColor: '#FFFFFF',
  footerTitleColor: '#FFFFFF',
};

export const useFirstLayoutStore = create<FirstLayoutStore>((set, get) => ({
  editableVariables: defaultEditableVariables,
  setEditableVariables: (vars) => {
    // Reemplazar completamente las variables con las del template
    set({ editableVariables: vars });
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
      return { editableVariables: updated };
    });
  },
}));
