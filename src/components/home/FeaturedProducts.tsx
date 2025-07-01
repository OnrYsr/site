'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const featuredProducts = [
  {
    id: 1,
    name: 'Modern Ev Tasarımı',
    price: 299.99,
    originalPrice: 399.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 124,
    discount: 25,
    slug: 'modern-ev-tasarimi'
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
    slug: 'futuristik-araba-modeli'
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
    slug: 'karakter-animasyon-modeli'
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
    slug: 'ofis-mobilya-seti'
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
    slug: 'elektronik-cihaz-koleksiyonu'
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
    slug: 'doga-manzara-seti'
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
    slug: 'spor-arac-modelleri'
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
    slug: 'fantastik-karakter-seti'
  }
];

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {featuredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/50 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-sm transform rotate-45"></div>
                </div>
              </div>
              
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  %{product.discount} İndirim
                </div>
              )}
              
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
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Sepete Ekle
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
        </motion.div>
      ))}
    </div>
  );
} 