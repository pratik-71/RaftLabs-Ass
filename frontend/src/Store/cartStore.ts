import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      buyNowItem: null,
      
      setBuyNowItem: (item) => set({ buyNowItem: item }),
      
      
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.product_id === item.product_id);
          if (existingItem) {
            return {
              items: state.items.map(i => 
                i.product_id === item.product_id 
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            };
          }
          return { items: [...state.items, item] };
        });
        
        // Sync to DB if signed in
        get().syncCart();
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.product_id !== productId)
        }));
        get().syncCart();
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(i => 
            i.product_id === productId ? { ...i, quantity } : i
          )
        }));
        get().syncCart();
      },
      
      clearCart: () => {
        set({ items: [] });
        get().syncCart();
      },
      
      syncCart: async () => {
        const user = useAuthStore.getState().user;
        const items = get().items;
        
        if (user) {
          // If signed in, save to DB
          console.log('Syncing cart to DB for user:', user.id, items);
          // In a real app, you would do: await axios.post('/api/cart', { items });
        } else {
          // If not signed in, zustand persist middleware automatically handles localStorage
          console.log('User not signed in, cart saved to localStorage only');
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
