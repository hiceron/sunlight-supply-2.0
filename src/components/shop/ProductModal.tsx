import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, ArrowLeftRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SearchFilters } from './SearchFilters';
import { useSearch } from '../../hooks/useSearch';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCartClick: () => void;
}

export function ProductModal({ isOpen, onClose, onCartClick }: ProductModalProps) {
  const { cartCount } = useCart();
  const { products, initialize } = useProducts();
  const { getFilteredProducts } = useSearch();
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredProducts = getFilteredProducts(products);

  const toggleProductComparison = (product: Product) => {
    setCompareProducts((current) => {
      const isSelected = current.some((p) => p.id === product.id);
      if (isSelected) {
        return current.filter((p) => p.id !== product.id);
      }
      if (current.length < 2) {
        return [...current, product];
      }
      return current;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Our Products</h2>
            <div className="flex items-center space-x-6">
              {compareProducts.length > 0 && (
                <button
                  onClick={() => setIsComparing(!isComparing)}
                  className="flex items-center space-x-2 text-[#0056b3] hover:text-[#004494]"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                  <span>Compare ({compareProducts.length})</span>
                </button>
              )}
              <button
                onClick={onCartClick}
                className="relative flex items-center text-gray-700 hover:text-[#0056b3] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff9900] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <SearchFilters />

            {isComparing && compareProducts.length === 2 ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Product Comparison</h3>
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="grid grid-cols-2 gap-8">
                    {compareProducts.map((product) => (
                      <div key={product.id} className="space-y-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="space-y-2">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-gray-600">${product.price}/ton</p>
                          <p className="text-sm">Stock: {product.availableQuantity} tons</p>
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <button
                      onClick={() => toggleProductComparison(product)}
                      className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
                        compareProducts.some((p) => p.id === product.id)
                          ? 'bg-[#0056b3] text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      <ArrowLeftRight className="w-5 h-5" />
                    </button>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}