import React from 'react';
import { Edit, Trash2, AlertTriangle, Layers, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../../../hooks/useProducts';

interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onVariants: (product: any) => void;
}

export function ProductList({ products, onEdit, onDelete, onVariants }: ProductListProps) {
  const { updateStock } = useProducts();

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 0) return;
    await updateStock(id, quantity);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <Package className="w-full h-full" />
        </div>
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {product.availableQuantity <= (product.reorderThreshold || 10) && (
              <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Low Stock
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              <span className="font-bold">${product.price}</span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Level
                </label>
                <input
                  type="number"
                  value={product.availableQuantity}
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                  min="0"
                  className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {product.category && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {product.category}
                </span>
              )}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => onVariants(product)}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Variants</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}