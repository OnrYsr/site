'use client';

import { useState, useEffect } from 'react';
import { Filter, X, ChevronLeft } from 'lucide-react';

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
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  showFilters,
  setShowFilters
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParentCategory, setCurrentParentCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // selectedCategory değiştiğinde currentParentCategory'yi güncelle
  useEffect(() => {
    if (selectedCategory === 'all') {
      setCurrentParentCategory(null);
    } else if (categories.length > 0) {
      // Ana kategori mi kontrol et
      const mainCategory = categories.find(cat => cat.slug === selectedCategory && !cat.parentId);
      if (mainCategory) {
        setCurrentParentCategory(mainCategory);
      } else {
        // Alt kategori ise, parent'ını bul
        for (const category of categories) {
          const subCategory = category.subcategories.find(sub => sub.slug === selectedCategory);
          if (subCategory) {
            setCurrentParentCategory(category);
            break;
          }
        }
      }
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        // Ana kategorileri al (parentId olmayan)
        const mainCategories = data.data.filter((cat: Category) => !cat.parentId);
        setCategories(mainCategories);
        console.log('Categories loaded:', mainCategories);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    console.log('Category clicked:', category.name, 'Subcategories:', category.subcategories);
    
    // Kategoriye git ve alt kategorileri göster
    setSelectedCategory(category.slug);
    setCurrentParentCategory(category);
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    setSelectedCategory(subcategory.slug);
  };

  const handleBackToMainCategories = () => {
    setSelectedCategory('all');
    setCurrentParentCategory(null);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentParentCategory ? currentParentCategory.name : 'Kategoriler'}
          </h3>
          {currentParentCategory && (
            <button
              onClick={handleBackToMainCategories}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Geri
            </button>
          )}
        </div>

        <div className="space-y-2">
          {currentParentCategory ? (
            // Alt kategoriler görünümü
            <>
              {/* Ana kategorinin tümü */}
              <button
                onClick={() => setSelectedCategory(currentParentCategory.slug)}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
                  selectedCategory === currentParentCategory.slug
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span>Tümü</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === currentParentCategory.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentParentCategory.productCount}
                </span>
              </button>

              {/* Alt kategoriler */}
              {currentParentCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSubcategoryClick(subcategory)}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
                    selectedCategory === subcategory.slug
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span>{subcategory.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === subcategory.slug
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {subcategory.productCount}
                  </span>
                </button>
              ))}
            </>
          ) : (
            // Ana kategoriler görünümü
            <>
              {/* Tüm Kategoriler */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                Tüm Kategoriler
              </button>

              {/* Ana kategoriler */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
                      selectedCategory === category.slug
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.slug
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.productCount}
                    </span>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentParentCategory(null);
          }}
          className="w-full px-4 py-3 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Kategori Filtresini Temizle
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