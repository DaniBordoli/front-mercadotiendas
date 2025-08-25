import { create } from 'zustand';

interface CheckoutStepState {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const useCheckoutStepStore = create<CheckoutStepState>((set, get) => ({
  currentStep: 1,
  setCurrentStep: (step: number) => set({ currentStep: step }),
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      set({ currentStep: currentStep + 1 });
    }
  },
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },
}));