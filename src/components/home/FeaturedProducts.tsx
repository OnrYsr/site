'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  rating: number;
  reviews: number;
  discount: number | null;
  slug: string;
  badgeText?: string;
  badgeColor?: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  type: string;
  order: number;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
    fetchFeaturedBanners();
  }, []);

  // Banner otomatik geçiş
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 saniyede bir geçiş

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?featured=true&sortBy=featured');
      const data = await response.json();

      if (data.success) {
        // İlk 8 öne çıkan ürünü al
        setProducts(data.data.slice(0, 8));
      } else {
        setError(data.error || 'Ürünler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Featured products fetch error:', err);
      setError('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBanners = async () => {
    try {
      setBannersLoading(true);
      const response = await fetch('/api/banners/active?type=FEATURED_PRODUCTS');
      const data = await response.json();

      if (data.success) {
        setBanners(data.data);
      } else {
        console.error('Featured banners fetch error:', data.error);
      }
    } catch (err) {
      console.error('Featured banners fetch error:', err);
    } finally {
      setBannersLoading(false);
    }
  };

  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const goToPreviousProduct = () => {
    setCurrentProductIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextProduct = () => {
    const maxIndex = Math.max(0, products.length - 4); // 4 ürün göster
    setCurrentProductIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En popüler ve beğenilen 3D modellerimizi keşfedin
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchFeaturedProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : null;

  return (
    <section className={`relative py-16 overflow-hidden ${!currentBanner ? 'bg-gray-50' : ''}`}>
      {/* Banner Background */}
      {currentBanner && (
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${currentBanner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </AnimatePresence>
          
          {/* Banner Navigation */}
          {banners.length > 1 && (
            <>
              <button
                onClick={goToPreviousBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={goToNextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentBannerIndex 
                        ? 'bg-white' 
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${currentBanner ? 'text-white' : ''}`}>
        {/* Section Header */}
        <div className="text-center mb-12">
          {currentBanner ? (
            <>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
              >
                {currentBanner.title}
              </motion.h2>
              {currentBanner.subtitle && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md"
                >
                  {currentBanner.subtitle}
                </motion.p>
              )}
              {currentBanner.link && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6"
                >
                  <Link
                    href={currentBanner.link}
                    className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all transform hover:scale-105 border border-white/30"
                  >
                    Keşfet
                  </Link>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Öne Çıkan Ürünler
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                En popüler ve beğenilen 3D modellerimizi keşfedin
              </motion.p>
            </>
          )}
        </div>

        {/* Products Carousel */}
        <div className={`relative mb-12 ${currentBanner ? 'backdrop-blur-sm bg-white/10 p-6 rounded-2xl' : ''}`}>
          {/* Products Navigation */}
          {products.length > 4 && (
            <>
              <button
                onClick={goToPreviousProduct}
                disabled={currentProductIndex === 0}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full transition-all ${
                  currentBanner 
                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white disabled:bg-white/10 disabled:text-white/50' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={goToNextProduct}
                disabled={currentProductIndex >= products.length - 4}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full transition-all ${
                  currentBanner 
                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white disabled:bg-white/10 disabled:text-white/50' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Products Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentProductIndex * (100 / 4)}%)`
              }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-none w-72 group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/50 rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-sm transform rotate-45"></div>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.discount && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      %{product.discount} İndirim
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link 
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tüm Ürünleri Görüntüle
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 