import React, { useState, useEffect } from 'react';
import { database } from '../../../lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { Plus, Search, Package, Edit, Trash2, X, Image, Save, Filter, Upload, Download } from 'lucide-react';
import { Card } from '../../ui/card';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { ProductForm } from '../products/ProductForm';
import { ProductFilters } from '../products/ProductFilters';
import { ProductList } from '../products/ProductList';
import { BulkUploadModal } from '../products/BulkUploadModal';
import { ProductVariantsModal } from '../products/ProductVariantsModal';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  availableQuantity: number;
  image: string;
  availableColors: string[];
  category: string;
  tags: string[];
  reorderThreshold: number;
  variants?: {
    [key: string]: {
      sku: string;
      price: number;
      quantity: number;
      attributes: {
        color?: string;
        size?: string;
      };
    };
  };
}

interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  lowStock: boolean;
  tags: string[];
}

const initialFilterState: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  inStock: false,
  lowStock: false,
  tags: [],
};

export function InventoryView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      setError('You do not have admin permissions.');
      setLoading(false);
      return;
    }

    const productsRef = ref(database, 'products');
    try {
      const unsubscribe = onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsList = Object.entries(data).map(([id, product]: [string, any]) => ({
            id,
            ...product,
          }));
          setProducts(productsList);
        } else {
          setProducts([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up products listener:', error);
      setError('Failed to connect to the database.');
      setLoading(false);
    }
  }, [isAdmin]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await remove(ref(database, `products/${productId}`));
      setError(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      const productId = productData.id || Date.now().toString();
      await set(ref(database, `products/${productId}`), {
        ...productData,
        id: productId,
      });
      setIsModalOpen(false);
      setSelectedProduct(null);
      setError(null);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleExportProducts = () => {
    const exportData = products.map(product => ({
      ...product,
      variants: product.variants ? Object.values(product.variants) : [],
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const matchesStock = !filters.inStock || product.availableQuantity > 0;
    const matchesLowStock = !filters.lowStock || product.availableQuantity <= product.reorderThreshold;
    const matchesTags = filters.tags.length === 0 || 
      filters.tags.every(tag => product.tags?.includes(tag));

    return matchesSearch && matchesCategory && matchesPrice && matchesStock && 
           matchesLowStock && matchesTags;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
          
          <button
            onClick={handleExportProducts}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            products={products}
          />
        </div>

        {/* Product List */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <ProductList
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onVariants={(product) => {
              setSelectedProduct(product);
              setIsVariantsModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Bulk Upload Modal */}
      {isBulkUploadOpen && (
        <BulkUploadModal
          onClose={() => setIsBulkUploadOpen(false)}
          onUpload={(data) => {
            // Handle bulk upload
            console.log('Bulk upload data:', data);
          }}
        />
      )}

      {/* Product Variants Modal */}
      {isVariantsModalOpen && selectedProduct && (
        <ProductVariantsModal
          product={selectedProduct}
          onClose={() => {
            setIsVariantsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}