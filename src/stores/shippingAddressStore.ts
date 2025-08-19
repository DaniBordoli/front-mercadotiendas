import { create } from 'zustand';

interface ShippingAddress {
    street: string;
    number: string;
    apartment?: string;
    city: string;
    postalCode: string;
    province: string;
    saveForFuture: boolean;
}

interface ShippingAddressState {
    address: ShippingAddress;
    setAddress: (address: Partial<ShippingAddress>) => void;
    resetAddress: () => void;
}

const defaultAddress: ShippingAddress = {
    street: '',
    number: '',
    apartment: '',
    city: '',
    postalCode: '',
    province: '',
    saveForFuture: false
};

export const useShippingAddressStore = create<ShippingAddressState>((set) => ({
    address: defaultAddress,
    setAddress: (newAddress) => set((state) => ({
        address: { ...state.address, ...newAddress }
    })),
    resetAddress: () => set({ address: defaultAddress })
}));