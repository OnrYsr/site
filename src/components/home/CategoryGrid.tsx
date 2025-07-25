'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

// Gradient renkleri
const gradientColors = [
  'from-blue-500 to-purple-600',
  'from-emerald-500 to-teal-600', 
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600',
  'from-green-500 to-emerald-600'
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories?homepage=true');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Kategoriler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
      setError('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchCategories}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
        />
      ))}
    </div>
  );
}

// Category Card Component
function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasValidImage = category.image && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/products?category=${category.slug}`}>
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          {/* Background Image or Gradient */}
          {hasValidImage ? (
            <>
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image!}
                  alt={category.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                {/* Loading Gradient Fallback */}
                {!imageLoaded && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} opacity-90`}></div>
                )}
              </div>
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          ) : (
            /* Fallback Gradient */
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} opacity-90`}></div>
          )}
          
          {/* Content */}
          <div className="relative p-6 h-48 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                {category.name}
              </h3>
              <p className="text-white/90 text-sm drop-shadow">
                {category.description || `${category.productCount} ürün`}
              </p>
              <p className="text-white/70 text-xs mt-1 drop-shadow">
                {category.productCount} ürün mevcut
              </p>
            </div>
            
            {/* Icon/Decoration */}
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
              </div>
            </div>
          </div>
          
          {/* Hover Effect */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Arrow */}
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 