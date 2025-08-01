'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image?: string;
  images?: string[];
  rating: number;
  reviews: number;
  discount: number | null;
  category: string;
  categorySlug?: string;
  slug: string;
  isNew: boolean;
  isFeatured: boolean;
  isSaleActive?: boolean;
  badgeText?: string;
  badgeColor?: string;
  stock?: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  // Image için fallback
  const productImage = product.image || (product.images && product.images[0]) || '/api/placeholder/300/300';

  // List View
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-sm transform rotate-45"></div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                {product.name}
              </h3>
            </Link>
            <div className="flex gap-1">
              <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">{product.category}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                ₺{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₺{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button 
              disabled={product.isSaleActive === false}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                product.isSaleActive === false
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.isSaleActive === false ? 'Satışa Kapalı' : 'Sepete Ekle'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/50 rounded-lg flex items-center justify-center">
            <div className="w-10 h-10 bg-blue-500 rounded-sm transform rotate-45"></div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isSaleActive === false && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Satışa Kapalı
            </div>
          )}
          {product.discount && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              %{product.discount} İndirim
            </div>
          )}
          {product.isNew && (
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Yeni
            </div>
          )}
          {product.badgeText && (
            <div
              className="text-white text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: product.badgeColor || '#6366f1' }}
            >
              {product.badgeText}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        {/* Add to Cart Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            disabled={product.isSaleActive === false}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              product.isSaleActive === false
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.isSaleActive === false ? 'Satışa Kapalı' : 'Sepete Ekle'}
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviews})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₺{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₺{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 