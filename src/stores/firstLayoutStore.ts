import { create } from 'zustand';
import { FirstLayoutEditableVariables } from '../components/organisms/CustomizableMenu/types';

interface FirstLayoutStore {
  editableVariables: FirstLayoutEditableVariables;
  setEditableVariables: (vars: FirstLayoutEditableVariables) => void;
  updateEditableVariables: (changes: Partial<FirstLayoutEditableVariables>) => void;
}

// Valores por defecto mínimos para el template
const defaultEditableVariables: FirstLayoutEditableVariables = {
  // Enlaces de navegación FIJOS - no modificables por IA
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
    // Preservar siempre los enlaces fijos de navegación
    const preservedNavbarLinks = [
      { label: 'Inicio', href: '/first-layout' },
      { label: 'Tienda', href: '/first-layout/shop-layout' },
      { label: 'Contacto', href: '/first-layout/contact-layout' },
      { label: 'Acerca de', href: '/first-layout/aboutus-layout' },
    ];
    
    // Reemplazar completamente las variables con las del template, pero preservar navbarLinks
    set({ 
      editableVariables: {
        ...vars,
        navbarLinks: preservedNavbarLinks // Siempre usar los enlaces fijos
      }
    });
  },
  updateEditableVariables: (changes) => {
    set((state) => {
      // Si hay cambios en navbarLinks, ignorarlos
      const { navbarLinks, ...allowedChanges } = changes;
      
      const updated = {
        ...state.editableVariables,
        ...allowedChanges, // Solo aplicar cambios permitidos
        filterOptions: changes.filterOptions
          ? { ...state.editableVariables.filterOptions, ...changes.filterOptions }
          : state.editableVariables.filterOptions,
        // Siempre preservar los enlaces fijos
        navbarLinks: [
          { label: 'Inicio', href: '/first-layout' },
          { label: 'Tienda', href: '/first-layout/shop-layout' },
          { label: 'Contacto', href: '/first-layout/contact-layout' },
          { label: 'Acerca de', href: '/first-layout/aboutus-layout' },
        ]
      };
      return { editableVariables: updated };
    });
  },
}));
