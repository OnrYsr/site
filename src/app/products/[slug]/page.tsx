'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const product = {
  name: 'Modern Ev Tasarımı',
  price: 299.99,
  originalPrice: 399.99,
  image: '/api/placeholder/400/400',
  rating: 4.8,
  reviews: 124,
  discount: 25,
  description: 'Yüksek kaliteli modern ev 3D modeli. Mimari projeleriniz için idealdir.',
  category: 'Mimari Modeller',
  slug: 'modern-ev-tasarimi',
  isNew: true,
  isFeatured: true,
  specs: 'Teknik özellikler burada yer alacak.',
  usage: 'Kullanım talimatları burada yer alacak.',
  maintenance: 'Bakım talimatları burada yer alacak.',
  lighting: 'Aydınlatma metni burada yer alacak.',
  shipping: 'Kargo bilgisi burada yer alacak.',
  returnPolicy: 'İptal, iade ve değişim süreci burada yer alacak.',
  material: 'Malzeme ve üretim bilgisi burada yer alacak.'
};

const tabs = [
  { key: 'specs', label: 'Teknik Özellikler' },
  { key: 'usage', label: 'Kullanım Talimatları' },
  { key: 'maintenance', label: 'Bakım Talimatları' },
  { key: 'lighting', label: 'Aydınlatma Metni' },
  { key: 'shipping', label: 'Kargo Bilgisi' },
  { key: 'returnPolicy', label: 'İptal / İade / Değişim' },
  { key: 'material', label: 'Malzeme & Üretim' },
];

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState('specs');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-8">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-40 h-40 bg-blue-500 rounded-lg transform rotate-45"></div>
            </div>
          </div>
          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({product.reviews} değerlendirme)
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-gray-900">₺{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">₺{product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  %{product.discount} İndirim
                </span>
              )}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Yeni
                </span>
              )}
            </div>
            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Sepete Ekle
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Favorilere Ekle
              </button>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Kategori: <Link href={`/products?category=${product.category}`} className="text-blue-600 hover:underline">{product.category}</Link>
            </div>
            <div className="text-sm text-gray-500">
              Stok Durumu: <span className="text-green-600 font-semibold">Stokta</span>
            </div>
          </div>
        </div>
        {/* Ürün açıklaması ve sekmeler yan yana */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Ürün Açıklaması */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Ürün Açıklaması</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
          {/* Accordion Sekmeler */}
          <div className="space-y-3">
            {tabs.map((tab) => (
              <div key={tab.key} className="border rounded-lg bg-white">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-900 font-medium focus:outline-none"
                  onClick={() => toggleAccordion(tab.key)}
                  aria-expanded={openAccordion === tab.key}
                >
                  <span>{tab.label}</span>
                  {openAccordion === tab.key ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {openAccordion === tab.key && (
                  <div className="px-4 pb-4 text-gray-700 text-sm border-t animate-fade-in">
                    {tab.key === 'specs' && <div>{product.specs}</div>}
                    {tab.key === 'usage' && <div>{product.usage}</div>}
                    {tab.key === 'maintenance' && <div>{product.maintenance}</div>}
                    {tab.key === 'lighting' && <div>{product.lighting}</div>}
                    {tab.key === 'shipping' && <div>{product.shipping}</div>}
                    {tab.key === 'returnPolicy' && <div>{product.returnPolicy}</div>}
                    {tab.key === 'material' && <div>{product.material}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 