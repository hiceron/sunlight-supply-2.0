import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartStore {
  cartItems: CartItem[];
  cartCount: number;
  total: number;
  addToCart: (product: Product & { selectedColor: string; quantity: number }) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  cartItems: [],
  cartCount: 0,
  total: 0,

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) =>
          item.id === product.id && item.selectedColor === product.selectedColor
      );

      let newItems;
      if (existingItem) {
        newItems = state.cartItems.map((item) =>
          item.id === product.id && item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        newItems = [...state.cartItems, product];
      }

      return {
        cartItems: newItems,
        cartCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }),

  removeFromCart: (item) =>
    set((state) => {
      const newItems = state.cartItems.filter(
        (i) => i.id !== item.id || i.selectedColor !== item.selectedColor
      );
      return {
        cartItems: newItems,
        cartCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }),

  updateQuantity: (item, quantity) =>
    set((state) => {
      const newItems = state.cartItems.map((i) =>
        i.id === item.id && i.selectedColor === item.selectedColor
          ? { ...i, quantity }
          : i
      );
      return {
        cartItems: newItems,
        cartCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }),

  clearCart: () =>
    set({
      cartItems: [],
      cartCount: 0,
      total: 0,
    }),
}));