'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  order: number;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveBanners();
  }, []);

  // Otomatik geçiş
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 saniyede bir geçiş

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchActiveBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners/active');
      const data = await response.json();

      if (data.success) {
        setBanners(data.data);
      } else {
        setError(data.error || 'Banner\'lar yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Banners fetch error:', err);
      setError('Banner\'lar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden h-96 lg:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden h-96 lg:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/80 mb-4">{error}</p>
            <button 
              onClick={fetchActiveBanners}
              className="text-white hover:underline"
            >
              Tekrar dene
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No banners - show default
  if (banners.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              En Kaliteli
              <span className="block text-yellow-300">3D Ürünler</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mt-2">
                Profesyonel Tasarımlar
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Binlerce yüksek kaliteli 3D model ve tasarım. Projelerinizi hayata geçirin.
            </p>
            
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Ürünleri Keşfet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white"
          style={{
            backgroundImage: currentBanner.image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentBanner.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center lg:text-left max-w-4xl">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {currentBanner.title}
              </motion.h1>
              
              {currentBanner.subtitle && (
                <motion.p 
                  className="text-xl md:text-2xl text-blue-100 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {currentBanner.subtitle}
                </motion.p>
              )}
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {currentBanner.link ? (
                  <Link
                    href={currentBanner.link}
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Keşfet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    href="/products"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Ürünleri Keşfet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
                
                <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
                  <Play className="mr-2 h-5 w-5" />
                  Demo İzle
                </button>
              </motion.div>
            </div>
          </div>

          {/* Navigation Controls */}
          {banners.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-white' 
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-white"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-white"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
} 