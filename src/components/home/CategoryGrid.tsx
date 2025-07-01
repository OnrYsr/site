'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Mimari Modeller',
    description: 'Bina ve yapı tasarımları',
    image: '/api/placeholder/300/200',
    color: 'from-blue-500 to-blue-600',
    slug: 'mimari-modeller'
  },
  {
    id: 2,
    name: 'Karakter Modelleri',
    description: 'İnsan ve hayvan karakterleri',
    image: '/api/placeholder/300/200',
    color: 'from-purple-500 to-purple-600',
    slug: 'karakter-modelleri'
  },
  {
    id: 3,
    name: 'Araç Modelleri',
    description: 'Otomobil ve araç tasarımları',
    image: '/api/placeholder/300/200',
    color: 'from-red-500 to-red-600',
    slug: 'arac-modelleri'
  },
  {
    id: 4,
    name: 'Mobilya Modelleri',
    description: 'Ev ve ofis mobilyaları',
    image: '/api/placeholder/300/200',
    color: 'from-green-500 to-green-600',
    slug: 'mobilya-modelleri'
  },
  {
    id: 5,
    name: 'Elektronik Modeller',
    description: 'Cihaz ve elektronik ürünler',
    image: '/api/placeholder/300/200',
    color: 'from-yellow-500 to-yellow-600',
    slug: 'elektronik-modeller'
  },
  {
    id: 6,
    name: 'Doğa Modelleri',
    description: 'Bitki ve doğa objeleri',
    image: '/api/placeholder/300/200',
    color: 'from-emerald-500 to-emerald-600',
    slug: 'doga-modelleri'
  }
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/products?category=${category.slug}`}>
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
              
              {/* Content */}
              <div className="relative p-6 h-48 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {category.description}
                  </p>
                </div>
                
                {/* Icon/Decoration */}
                <div className="flex justify-end">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Arrow */}
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 