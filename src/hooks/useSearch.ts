import { create } from 'zustand';
import Fuse from 'fuse.js';
import { Product } from '../types';
import { useProducts } from './useProducts';

interface FilterOptions {
  priceRange: [number, number];
  colors: string[];
  category: string;
  inStock: boolean;
  lowStock: boolean;
}

interface SearchStore {
  searchTerm: string;
  filters: FilterOptions;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  getFilteredProducts: (products: Product[]) => Product[];
}

const defaultFilters: FilterOptions = {
  priceRange: [0, 1000],
  colors: [],
  category: 'all',
  inStock: false,
  lowStock: false,
};

export const useSearch = create<SearchStore>((set, get) => ({
  searchTerm: '',
  filters: defaultFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  getFilteredProducts: (products) => {
    const { searchTerm, filters } = get();
    let filteredProducts = [...products];

    // Apply search if term exists
    if (searchTerm) {
      const fuse = new Fuse(filteredProducts, {
        keys: ['name', 'description', 'sku', 'category'],
        threshold: 0.3,
      });
      const searchResults = fuse.search(searchTerm);
      filteredProducts = searchResults.map((result) => result.item);
    }

    // Apply filters
    return filteredProducts.filter((product) => {
      const priceInRange =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      const colorMatch =
        filters.colors.length === 0 ||
        product.availableColors.some((color) => filters.colors.includes(color));

      const categoryMatch =
        filters.category === 'all' || product.category === filters.category;

      const stockMatch = !filters.inStock || product.availableQuantity > 0;

      const lowStockMatch =
        !filters.lowStock ||
        product.availableQuantity <= (product.reorderThreshold || 10);

      return priceInRange && colorMatch && categoryMatch && stockMatch && lowStockMatch;
    });
  },
}));