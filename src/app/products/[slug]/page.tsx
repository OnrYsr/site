'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingCart, Star, Heart, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: string;
  categorySlug: string;
  rating: number;
  reviews: number;
  discount: number | null;
  badgeText: string | null;
  badgeColor: string | null;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

const tabs = [
  { key: 'specs', label: 'Teknik Özellikler' },
  { key: 'usage', label: 'Kullanım Talimatları' },
  { key: 'maintenance', label: 'Bakım Talimatları' },
  { key: 'lighting', label: 'Aydınlatma Metni' },
  { key: 'shipping', label: 'Kargo Bilgisi' },
  { key: 'returnPolicy', label: 'İptal / İade / Değişim' },
  { key: 'material', label: 'Malzeme & Üretim' },
];

// Accordion içeriği için placeholder metinler
const tabContent = {
  specs: 'Bu ürünün teknik özellikleri burada yer alacaktır. Boyutlar, malzeme bilgileri ve diğer teknik detaylar.',
  usage: 'Ürünün kullanım talimatları burada yer alacaktır. Nasıl kullanılacağı, dikkat edilmesi gereken noktalar.',
  maintenance: 'Bakım talimatları burada yer alacaktır. Temizleme ve bakım önerileri.',
  lighting: 'Aydınlatma önerileri burada yer alacaktır. En iyi görüntü için önerilen aydınlatma koşulları.',
  shipping: 'Kargo bilgileri burada yer alacaktır. Teslimat süreleri ve kargo seçenekleri.',
  returnPolicy: 'İptal, iade ve değişim koşulları burada yer alacaktır. Garanti ve iade süreci.',
  material: 'Malzeme ve üretim bilgileri burada yer alacaktır. Hangi malzemeden yapıldığı ve üretim süreci.'
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${slug}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setProduct(data.data);
      } else {
        setError('Ürün bulunamadı');
      }
    } catch (err) {
      console.error('Product fetch error:', err);
      setError('Ürün yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const getProductImage = () => {
    if (!product?.images || product.images.length === 0) {
      return '/api/placeholder/400/400';
    }
    return product.images[0];
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice || !product?.price) return null;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-8">{error || 'Aradığınız ürün mevcut değil.'}</p>
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = calculateDiscount();
  const productImage = getProductImage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-8">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <img
                  src={productImage}
                  alt={product.name}
                  className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-40 h-40 bg-blue-500 rounded-lg transform rotate-45"></div>
              )}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              )}
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
              {discountPercentage && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  %{discountPercentage} İndirim
                </span>
              )}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Yeni
                </span>
              )}
              {product.badgeText && (
                <span 
                  className={`text-white text-xs font-bold px-2 py-1 rounded-full ${
                    product.badgeColor === 'blue' ? 'bg-blue-500' :
                    product.badgeColor === 'green' ? 'bg-green-500' :
                    product.badgeColor === 'red' ? 'bg-red-500' :
                    product.badgeColor === 'yellow' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}
                >
                  {product.badgeText}
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
              Kategori: <Link href={`/products?category=${product.categorySlug}`} className="text-blue-600 hover:underline">{product.category}</Link>
            </div>
            <div className="text-sm text-gray-500">
              Stok Durumu: <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Tükendi'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Ürün açıklaması ve sekmeler yan yana */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Ürün Açıklaması */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Ürün Açıklaması</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description || 'Bu ürün için henüz detaylı açıklama eklenmemiştir.'}
            </p>
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
                    {tabContent[tab.key as keyof typeof tabContent]}
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