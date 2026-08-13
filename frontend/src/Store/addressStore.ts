import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface AddressStore {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, { ...address, id: crypto.randomUUID() }],
        })),
      updateAddress: (id, updatedAddress) =>
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...updatedAddress } : a)),
        })),
      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
    }),
    {
      name: 'address-storage',
    }
  )
);
