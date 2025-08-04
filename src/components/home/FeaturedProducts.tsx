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
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchFeaturedProducts();
    fetchFeaturedBanners();
  }, []);

  // Banner otomatik geçiş
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000); // 6 saniyede bir geçiş

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?featured=true&sortBy=featured');
      const data = await response.json();

      if (data.success) {
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

  const goToPreviousProduct = () => {
    setCurrentProductIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextProduct = () => {
    setCurrentProductIndex((prev) => Math.min(products.length - 4, prev + 1));
  };

  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handleImageLoad = (productId: string) => {
    setImageLoaded(prev => ({ ...prev, [productId]: true }));
  };

  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Ürünler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchFeaturedProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Henüz öne çıkan ürün bulunmuyor.</p>
      </div>
    );
  }

  const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : null;

  return (
    <section className="relative overflow-hidden min-h-[700px] bg-black">
      {/* Full-Screen Banner Background */}
      <div className="absolute inset-0">
        {currentBanner ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${currentBanner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
        )}
      </div>

      {/* Banner Navigation */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPreviousBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Banner Dots */}
          <div className="absolute top-6 right-6 flex space-x-2 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBannerIndex 
                    ? 'bg-white' 
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content Overlay */}
      <div className="relative z-20 min-h-[700px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            >
              Öne Çıkan Ürünler
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md"
            >
              En popüler ve beğenilen 3D modellerimizi keşfedin
            </motion.p>
          </div>

          {/* Products Carousel */}
          <div className="relative mb-12">
            {/* Products Navigation */}
            {products.length > 4 && (
              <>
                <button
                  onClick={goToPreviousProduct}
                  disabled={currentProductIndex === 0}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full transition-all bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white disabled:bg-white/10 disabled:text-white/50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={goToNextProduct}
                  disabled={currentProductIndex >= products.length - 4}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full transition-all bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white disabled:bg-white/10 disabled:text-white/50"
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
                    className="flex-none w-72 group bg-white/95 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {!imageError[product.id] && product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            imageLoaded[product.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => handleImageLoad(product.id)}
                          onError={() => handleImageError(product.id)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/50 rounded-lg flex items-center justify-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-sm transform rotate-45"></div>
                          </div>
                        </div>
                      )}
                      
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
                        <Link href={`/products/${product.slug}`}>
                          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </Link>
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
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all shadow-lg border border-white/30"
            >
              Tüm Ürünleri Görüntüle
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 