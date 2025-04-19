import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import { AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { updateStock } = useProducts();

  const handleAddToCart = async () => {
    if (quantity > product.availableQuantity) {
      alert('Not enough stock available');
      return;
    }

    addToCart({
      ...product,
      selectedColor,
      quantity,
    });

    // Update stock level
    await updateStock(product.id, product.availableQuantity - quantity);
  };

  const isLowStock = product.availableQuantity <= (product.reorderThreshold || 10);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="text-lg font-bold">${product.price}/ton</span>
        </div>

        <div className="space-y-4">
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {product.availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? 'border-[#0056b3]'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (tons) - {product.availableQuantity} available
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {Array.from(
                { length: Math.min(10, product.availableQuantity) },
                (_, i) => i + 1
              ).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.availableQuantity === 0}
            className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}