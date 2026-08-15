import { create } from 'zustand';
import { supabase } from '../Config/supabase';

export interface Address {
  id: number | string;
  name: string;
  address: string;
  phone: string;
}

interface AddressStore {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: (userId: string) => Promise<void>;
  addAddress: (userId: string, address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (userId: string, id: number | string, address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: number | string) => Promise<void>;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  loading: false,
  fetchAddresses: async (userId: string) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });
        
      if (error) throw error;
      set({ addresses: data || [] });
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      set({ loading: false });
    }
  },
  addAddress: async (userId: string, address) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([{ user_id: userId, ...address }])
        .select()
        .single();
        
      if (error) throw error;
      set((state) => ({
        addresses: [data, ...state.addresses]
      }));
    } catch (err) {
      console.error('Error adding address:', err);
      throw err;
    }
  },
  updateAddress: async (_userId: string, id, updatedAddress) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update(updatedAddress)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      set((state) => ({
        addresses: state.addresses.map((a) => (a.id === id ? data : a)),
      }));
    } catch (err) {
      console.error('Error updating address:', err);
      throw err;
    }
  },
  deleteAddress: async (id) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id),
      }));
    } catch (err) {
      console.error('Error deleting address:', err);
      throw err;
    }
  },
}));
