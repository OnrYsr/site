'use client';

import { useState, useEffect } from 'react';
import { Filter, X, ChevronRight, ChevronDown } from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  productCount: number;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        // Only show main categories (no parentId) in filters
        const mainCategories = data.data.filter((cat: Category) => !cat.parentId);
        setCategories(mainCategories);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
        <div className="space-y-3">
          {/* Tüm Kategoriler Butonu */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="font-medium">Tüm Kategoriler</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${
              selectedCategory === 'all' ? 'rotate-90' : ''
            }`} />
          </button>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="space-y-2">
                {/* Ana Kategori */}
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`flex-1 flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      selectedCategory === category.slug
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedCategory === category.slug
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.productCount}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          selectedCategory === category.slug ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                  </button>
                  
                  {/* Alt kategoriler varsa expand/collapse butonu */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleCategoryExpansion(category.id)}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Alt Kategoriler */}
                {category.subcategories && 
                 category.subcategories.length > 0 && 
                 expandedCategories.includes(category.id) && (
                  <div className="ml-4 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => setSelectedCategory(subcategory.slug)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-200 text-sm ${
                          selectedCategory === subcategory.slug
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                      >
                        <span className="font-medium">{subcategory.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === subcategory.slug
                            ? 'bg-blue-200 text-blue-700'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {subcategory.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                  className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 font-medium ${
                    priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
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
            setExpandedCategories([]);
          }}
          className="w-full px-4 py-3 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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