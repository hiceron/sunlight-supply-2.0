import { create } from 'zustand';
import { database } from '../lib/firebase';
import { ref, onValue, set, update, remove } from 'firebase/database';
import { Product } from '../types';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  initialize: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<void>;
}

export const useProducts = create<ProductStore>((set, get) => ({
  products: [],
  loading: true,
  error: null,

  initialize: () => {
    const productsRef = ref(database, 'products');
    try {
      const unsubscribe = onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsList = Object.entries(data).map(([id, product]: [string, any]) => ({
            id,
            ...product,
          }));
          set({ products: productsList, loading: false });
        } else {
          set({ products: [], loading: false });
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up products listener:', error);
      set({ error: 'Failed to connect to products service', loading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const id = Date.now().toString();
      const productRef = ref(database, `products/${id}`);
      await set(productRef, {
        ...product,
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const productRef = ref(database, `products/${id}`);
      await update(productRef, {
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const productRef = ref(database, `products/${id}`);
      await remove(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  updateStock: async (id, quantity) => {
    try {
      const productRef = ref(database, `products/${id}`);
      await update(productRef, {
        availableQuantity: quantity,
        updatedAt: Date.now(),
      });

      // Check if stock is low and create notification if needed
      const product = get().products.find(p => p.id === id);
      if (product && quantity <= (product.reorderThreshold || 10)) {
        const notificationRef = ref(database, `notifications/${Date.now()}`);
        await set(notificationRef, {
          type: 'stock',
          title: 'Low Stock Alert',
          message: `${product.name} is running low (${quantity} tons remaining)`,
          timestamp: Date.now(),
          read: false,
          priority: 'high',
        });
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },
}));