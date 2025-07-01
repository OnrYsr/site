'use client';

import { useState } from 'react';
import { Filter, Grid, List, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';

const products = [
  {
    id: 1,
    name: 'Modern Ev Tasarımı',
    price: 299.99,
    originalPrice: 399.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    discount: 25,
    category: 'Mimari Modeller',
    slug: 'modern-ev-tasarimi',
    isNew: true,
    isFeatured: true
  },
  {
    id: 2,
    name: 'Futuristik Araba Modeli',
    price: 199.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 89,
    discount: null,
    category: 'Araç Modelleri',
    slug: 'futuristik-araba-modeli',
    isNew: true,
    isFeatured: false
  },
  {
    id: 3,
    name: 'Karakter Animasyon Modeli',
    price: 149.99,
    originalPrice: 199.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 156,
    discount: 25,
    category: 'Karakter Modelleri',
    slug: 'karakter-animasyon-modeli',
    isNew: false,
    isFeatured: true
  },
  {
    id: 4,
    name: 'Ofis Mobilya Seti',
    price: 399.99,
    originalPrice: 499.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 78,
    discount: 20,
    category: 'Mobilya Modelleri',
    slug: 'ofis-mobilya-seti',
    isNew: false,
    isFeatured: false
  },
  {
    id: 5,
    name: 'Elektronik Cihaz Koleksiyonu',
    price: 249.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 203,
    discount: null,
    category: 'Elektronik Modeller',
    slug: 'elektronik-cihaz-koleksiyonu',
    isNew: true,
    isFeatured: true
  },
  {
    id: 6,
    name: 'Doğa Manzara Seti',
    price: 179.99,
    originalPrice: 229.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 167,
    discount: 22,
    category: 'Doğa Modelleri',
    slug: 'doga-manzara-seti',
    isNew: false,
    isFeatured: false
  },
  {
    id: 7,
    name: 'Spor Araç Modelleri',
    price: 329.99,
    originalPrice: 429.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 92,
    discount: 23,
    category: 'Araç Modelleri',
    slug: 'spor-arac-modelleri',
    isNew: false,
    isFeatured: true
  },
  {
    id: 8,
    name: 'Fantastik Karakter Seti',
    price: 269.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 134,
    discount: null,
    category: 'Karakter Modelleri',
    slug: 'fantastik-karakter-seti',
    isNew: true,
    isFeatured: false
  },
  {
    id: 9,
    name: 'Villa Tasarımı',
    price: 599.99,
    originalPrice: 699.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 45,
    discount: 14,
    category: 'Mimari Modeller',
    slug: 'villa-tasarimi',
    isNew: false,
    isFeatured: true
  },
  {
    id: 10,
    name: 'Gaming Setup',
    price: 189.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 78,
    discount: null,
    category: 'Elektronik Modeller',
    slug: 'gaming-setup',
    isNew: true,
    isFeatured: false
  },
  {
    id: 11,
    name: 'Bahçe Mobilyası',
    price: 159.99,
    originalPrice: 199.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 67,
    discount: 20,
    category: 'Mobilya Modelleri',
    slug: 'bahce-mobilyasi',
    isNew: false,
    isFeatured: false
  },
  {
    id: 12,
    name: 'Orman Manzarası',
    price: 129.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 89,
    discount: null,
    category: 'Doğa Modelleri',
    slug: 'orman-manzarasi',
    isNew: false,
    isFeatured: false
  }
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return a.isNew ? -1 : 1;
      default:
        return a.isFeatured ? -1 : 1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürünler</h1>
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
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
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filtreler
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="featured">Öne Çıkanlar</option>
                  <option value="newest">En Yeniler</option>
                  <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                  <option value="rating">En Çok Beğenilenler</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
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

            {/* Products Grid */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ürün bulunamadı
                </h3>
                <p className="text-gray-600 mb-4">
                  Seçtiğiniz kriterlere uygun ürün bulunamadı. Filtreleri değiştirmeyi deneyin.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 