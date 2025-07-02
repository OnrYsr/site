'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  showFilters,
  setShowFilters
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">
              Tüm Kategoriler
            </span>
          </label>
          
          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <label key={category.id} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.slug}
                    checked={selectedCategory === category.slug}
                    onChange={() => setSelectedCategory(category.slug)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({category.productCount})
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Aralığı</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          
          {/* Quick Price Filters */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Hızlı Seçim</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '0-100₺', range: [0, 100] as [number, number] },
                { label: '100-250₺', range: [100, 250] as [number, number] },
                { label: '250-500₺', range: [250, 500] as [number, number] },
                { label: '500₺+', range: [500, 1000] as [number, number] }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setPriceRange(option.range)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setPriceRange([0, 1000]);
          }}
          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg p-6 shadow">
        {filterContent}
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filtreler</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
              <div className="mt-6">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Filtreleri Uygula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 