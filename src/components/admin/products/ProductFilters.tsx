import React from 'react';
import { Filter } from 'lucide-react';

interface FilterProps {
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
    lowStock: boolean;
    tags: string[];
  };
  onFilterChange: (filters: any) => void;
  products: any[];
}

export function ProductFilters({ filters, onFilterChange, products }: FilterProps) {
  // Extract unique categories and tags from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const allTags = [...new Set(products.flatMap(p => p.tags || []))];

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5" />
        <h2 className="font-semibold">Filters</h2>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Min"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Max"
            min="0"
          />
        </div>
      </div>

      {/* Stock Filters */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock Status
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 text-sm text-gray-600">
            In Stock Only
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowStock"
            checked={filters.lowStock}
            onChange={(e) => onFilterChange({ ...filters, lowStock: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="lowStock" className="ml-2 text-sm text-gray-600">
            Low Stock Alert
          </label>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.tags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset Filters */}
      <button
        onClick={() => onFilterChange({
          category: 'all',
          minPrice: 0,
          maxPrice: 1000,
          inStock: false,
          lowStock: false,
          tags: [],
        })}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}