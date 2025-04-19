import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ProductVariantsModalProps {
  product: any;
  onClose: () => void;
  onSave: (productData: any) => void;
}

interface Variant {
  sku: string;
  price: number;
  quantity: number;
  attributes: {
    color?: string;
    size?: string;
  };
}

export function ProductVariantsModal({ product, onClose, onSave }: ProductVariantsModalProps) {
  const [variants, setVariants] = useState<Record<string, Variant>>(
    product.variants || {}
  );
  const [error, setError] = useState<string | null>(null);

  const handleAddVariant = () => {
    const variantId = Date.now().toString();
    setVariants(prev => ({
      ...prev,
      [variantId]: {
        sku: `${product.sku}-${Object.keys(variants).length + 1}`,
        price: product.price,
        quantity: 0,
        attributes: {
          color: product.availableColors[0],
        }
      }
    }));
  };

  const handleRemoveVariant = (variantId: string) => {
    const newVariants = { ...variants };
    delete newVariants[variantId];
    setVariants(newVariants);
  };

  const handleVariantChange = (variantId: string, field: string, value: any) => {
    setVariants(prev => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [field]: value
      }
    }));
  };

  const handleAttributeChange = (variantId: string, attribute: string, value: string) => {
    setVariants(prev => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        attributes: {
          ...prev[variantId].attributes,
          [attribute]: value
        }
      }
    }));
  };

  const handleSave = () => {
    // Validation
    for (const [id, variant] of Object.entries(variants)) {
      if (!variant.sku || variant.price <= 0 || variant.quantity < 0) {
        setError('All variants must have valid SKU, price, and quantity');
        return;
      }
    }

    onSave({
      ...product,
      variants
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Product Variants</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Variants for {product.name}</h3>
            <button
              onClick={handleAddVariant}
              className="flex items-center space-x-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(variants).map(([variantId, variant]) => (
              <div
                key={variantId}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">Variant #{variantId}</h4>
                  <button
                    onClick={() => handleRemoveVariant(variantId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(variantId, 'sku', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(variantId, 'price', Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => handleVariantChange(variantId, 'quantity', Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      value={variant.attributes.color}
                      onChange={(e) => handleAttributeChange(variantId, 'color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {product.availableColors.map((color: string) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      value={variant.attributes.size || ''}
                      onChange={(e) => handleAttributeChange(variantId, 'size', e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Save Variants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}