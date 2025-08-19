import { create } from 'zustand';

interface PaymentMethodState {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    resetPaymentMethod: () => void;
}

export const usePaymentMethodStore = create<PaymentMethodState>((set) => ({
    paymentMethod: 'tarjeta',
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    resetPaymentMethod: () => set({ paymentMethod: 'tarjeta' }),
}));
