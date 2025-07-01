'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const categories = [
  { id: 'all', name: 'Tüm Kategoriler' },
  { id: 'Mimari Modeller', name: 'Mimari Modeller' },
  { id: 'Karakter Modelleri', name: 'Karakter Modelleri' },
  { id: 'Araç Modelleri', name: 'Araç Modelleri' },
  { id: 'Mobilya Modelleri', name: 'Mobilya Modelleri' },
  { id: 'Elektronik Modeller', name: 'Elektronik Modeller' },
  { id: 'Doğa Modelleri', name: 'Doğa Modelleri' }
];

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  showFilters,
  setShowFilters
}: ProductFiltersProps) {
  const [showOnMobile, setShowOnMobile] = useState(false);

  const handlePriceChange = (index: number, value: string) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = parseFloat(value) || 0;
    setPriceRange(newRange);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
  };

  const filterContent = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtreler
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          Temizle
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Kategoriler</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <span className="text-gray-500 self-center">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="text-xs text-gray-500">
            ₺{priceRange[0]} - ₺{priceRange[1]}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Özellikler</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">İndirimli Ürünler</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Yeni Ürünler</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Öne Çıkanlar</span>
          </label>
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Değerlendirme</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {rating} yıldız ve üzeri
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        {filterContent}
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowOnMobile(!showOnMobile)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4"
        >
          <span className="font-medium text-gray-900">Filtreler</span>
          <Filter className="w-5 h-5 text-gray-500" />
        </button>

        {/* Mobile Filter Overlay */}
        {showOnMobile && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowOnMobile(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                  <button
                    onClick={() => setShowOnMobile(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {filterContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 