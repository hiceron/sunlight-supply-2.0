import React, { useState, useEffect } from 'react';
import { database } from '../../lib/firebase';
import { ref, set, onValue } from 'firebase/database';
import { PackageSearch, Plus, Search, X } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, user } = useAuth();
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    availableQuantity: 0,
    availableColors: ['#FFFFFF'],
    image: '',
  });

  useEffect(() => {
    if (!isAdmin || !user) {
      setLoading(false);
      setError('Unauthorized access');
      return;
    }

    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      try {
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
        setError(null);
      } catch (error: any) {
        console.error('Error loading products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isAdmin, user]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      setError(null);
      if (!isAdmin || !user) throw new Error('Unauthorized');
      
      const productRef = ref(database, `products/${productId}/availableQuantity`);
      await set(productRef, newQuantity);
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      setError(error.message || 'Failed to update quantity');
    }
  };

  const handleAddProduct = async () => {
    try {
      setError(null);
      if (!isAdmin || !user) throw new Error('Unauthorized');
      
      const productId = Date.now().toString();
      const productRef = ref(database, `products/${productId}`);
      
      await set(productRef, {
        ...newProduct,
        id: productId,
        availableColors: newProduct.availableColors || ['#FFFFFF'],
      });
      
      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        price: 0,
        availableQuantity: 0,
        availableColors: ['#FFFFFF'],
        image: '',
      });
    } catch (error: any) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <PackageSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <PackageSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={item}>
              <Card className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">${product.price}</span>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Quantity:</label>
                      <input
                        type="number"
                        value={product.availableQuantity}
                        onChange={(e) => handleUpdateQuantity(product.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors.map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full m-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setIsAddingProduct(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newProduct.availableQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, availableQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}