'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

const cartItems = [
  {
    id: 1,
    name: 'Modern Ev Tasarımı',
    price: 299.99,
    image: '/api/placeholder/100/100',
    quantity: 1,
    slug: 'modern-ev-tasarimi'
  },
  {
    id: 2,
    name: 'Futuristik Araba Modeli',
    price: 199.99,
    image: '/api/placeholder/100/100',
    quantity: 2,
    slug: 'futuristik-araba-modeli'
  }
];

export default function CartPage() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sepetiniz boş</h2>
            <p className="text-gray-500 mb-6">Alışverişe devam etmek için ürünleri inceleyin.</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg shadow p-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-sm transform rotate-45"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                    <div className="text-gray-500 text-sm mt-1">Adet: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">₺{item.price.toFixed(2)}</div>
                  <button className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                <div className="flex justify-between mb-2">
                  <span>Ara Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Kargo</span>
                  <span>₺0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Ödemeye Geç
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 