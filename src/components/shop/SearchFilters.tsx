import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../hooks/useSearch';
import { useProducts } from '../../hooks/useProducts';
import { Search, SlidersHorizontal, Package } from 'lucide-react';

export function SearchFilters() {
  const { t } = useTranslation();
  const { searchTerm, filters, setSearchTerm, setFilters, resetFilters } = useSearch();
  const { products } = useProducts();
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Get unique colors from all products
  const availableColors = [...new Set(products.flatMap(p => p.availableColors))];

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('shop.filters.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] focus:border-transparent"
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center space-x-2 text-gray-600 hover:text-[#0056b3]"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>{t('shop.filters.filters')}</span>
        </button>
        <button
          onClick={resetFilters}
          className="text-sm text-[#0056b3] hover:text-[#004494]"
        >
          {t('shop.filters.reset')}
        </button>
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('shop.filters.category')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? t('shop.filters.allCategories') : category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('shop.filters.priceRange')}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  setFilters({ priceRange: [Number(e.target.value), filters.priceRange[1]] })
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] focus:border-transparent"
                min="0"
                placeholder={t('shop.filters.min')}
              />
              <span>{t('shop.filters.to')}</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056b3] focus:border-transparent"
                min="0"
                placeholder={t('shop.filters.max')}
              />
            </div>
          </div>

          {/* Stock Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('shop.filters.stockStatus')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ inStock: e.target.checked })}
                  className="h-4 w-4 text-[#0056b3] focus:ring-[#0056b3] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">{t('shop.filters.inStockOnly')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.lowStock}
                  onChange={(e) => setFilters({ lowStock: e.target.checked })}
                  className="h-4 w-4 text-[#0056b3] focus:ring-[#0056b3] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">{t('shop.filters.lowStock')}</span>
              </label>
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('shop.filters.colors')}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    const newColors = filters.colors.includes(color)
                      ? filters.colors.filter(c => c !== color)
                      : [...filters.colors, color];
                    setFilters({ colors: newColors });
                  }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    filters.colors.includes(color)
                      ? 'border-[#0056b3]'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}