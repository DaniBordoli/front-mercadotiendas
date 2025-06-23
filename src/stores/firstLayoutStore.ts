import { create } from 'zustand';
import { FirstLayoutEditableVariables } from '../components/organisms/CustomizableMenu/types';

interface FirstLayoutStore {
  editableVariables: FirstLayoutEditableVariables;
  setEditableVariables: (vars: FirstLayoutEditableVariables) => void;
  updateEditableVariables: (changes: Partial<FirstLayoutEditableVariables>) => void;
}

export const useFirstLayoutStore = create<FirstLayoutStore>((set, get) => ({
  editableVariables: {} as FirstLayoutEditableVariables,
  setEditableVariables: (vars) => {
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
