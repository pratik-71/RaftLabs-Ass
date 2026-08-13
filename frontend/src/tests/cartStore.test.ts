import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../Store/cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add item to cart', () => {
    const item = { product_id: 1, name: 'Burger', price: 10, quantity: 1, imageUrl: '' };
    useCartStore.getState().addToCart(item);
    
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].name).toBe('Burger');
  });

  it('should increase quantity if item already exists', () => {
    const item = { product_id: 1, name: 'Burger', price: 10, quantity: 1, imageUrl: '' };
    useCartStore.getState().addToCart(item);
    useCartStore.getState().addToCart(item);
    
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const item = { product_id: 1, name: 'Burger', price: 10, quantity: 1, imageUrl: '' };
    useCartStore.getState().addToCart(item);
    useCartStore.getState().removeFromCart(1);
    
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('should update item quantity', () => {
    const item = { product_id: 1, name: 'Burger', price: 10, quantity: 1, imageUrl: '' };
    useCartStore.getState().addToCart(item);
    useCartStore.getState().updateQuantity(1, 5);
    
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });
});
