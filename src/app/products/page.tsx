'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  rating: number;
  reviews: number;
  discount: number | null;
  category: string;
  categorySlug: string;
  slug: string;
  isNew: boolean;
  isFeatured: boolean;
  badgeText?: string;
  badgeColor?: string;
  stock: number;
  description: string;
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
  subcategories: any[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // URL parametresinden category'yi oku
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Kategorileri bir kez çek
  useEffect(() => {
    fetchCategories();
  }, []);

  // API'dan ürünleri çek
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || 'Ürünler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setError('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  // Kategori adını bul
  const getCurrentCategoryName = () => {
    if (selectedCategory === 'all') {
      return 'Ürünler';
    }

    // Önce ana kategorilerde ara
    const mainCategory = categories.find(cat => cat.slug === selectedCategory && !cat.parentId);
    if (mainCategory) {
      return `${mainCategory.name} Ürünleri`;
    }

    // Alt kategorilerde ara
    for (const category of categories) {
      const subCategory = category.subcategories.find(sub => sub.slug === selectedCategory);
      if (subCategory) {
        return `${subCategory.name} Ürünleri`;
      }
    }

    return 'Ürünler';
  };

  // Ürün sayısı
  const productCount = products.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getCurrentCategoryName()}</h1>
          <p className="text-gray-600">
            {productCount} ürün bulundu
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Kategori Filtreleri
                </button>

                {/* Sort Options */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sıralama:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortBy('featured')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        sortBy === 'featured'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      Öne Çıkanlar
                    </button>
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        sortBy === 'newest'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      En Yeniler
                    </button>
                    <button
                      onClick={() => setSortBy('name')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        sortBy === 'name'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      İsme Göre
                    </button>
                    <button
                      onClick={() => setSortBy('price-low')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        sortBy === 'price-low'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      Fiyat ↑
                    </button>
                    <button
                      onClick={() => setSortBy('price-high')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        sortBy === 'price-high'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      Fiyat ↓
                    </button>
                  </div>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700 mr-2">Görünüm:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-gray-500 mb-4">Bu kategoride ürün bulunamadı</div>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Tüm Ürünleri Görüntüle
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      image: product.images[0] || '/api/placeholder/300/300'
                    }}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 