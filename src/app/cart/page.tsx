'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { data: session, status } = useSession();
  const { items, totalAmount, totalItems, isLoading, removeFromCart, updateCartItem } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Debug için console log
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    console.log('Cart items:', items);
    console.log('Cart loading:', isLoading);
    console.log('Cart total:', totalAmount);
  }, [status, session, items, isLoading, totalAmount]);

  // Authentication kontrolü
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Giriş Gerekli</h1>
          <p className="text-gray-600 mb-6">Sepetinizi görüntülemek için giriş yapmalısınız.</p>
          <Link href="/auth/login?callbackUrl=/cart" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set([...prev, cartItemId]));
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Adet güncellenirken hata oluştu');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setUpdatingItems(prev => new Set([...prev, cartItemId]));
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Ürün silinirken hata oluştu');
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>
        
        {/* Debug info */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Debug: {items.length} ürün, Toplam: ₺{totalAmount.toFixed(2)}, Loading: {isLoading.toString()}, Auth: {status}
          </p>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sepetiniz boş</h2>
            <p className="text-gray-500 mb-6">Alışverişe devam etmek için ürünleri inceleyin.</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sol taraf - Ürün Listesi */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ürünlerim</h2>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {item.product.images && item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-sm transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1">{item.product.category.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.id) || item.quantity <= 1}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingItems.has(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">₺{(Number(item.product.price) * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-gray-500">₺{item.product.price.toFixed(2)} / adet</div>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updatingItems.has(item.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ taraf - Sipariş Özeti */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        {item.product.images && item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="w-5 h-5 bg-blue-500 rounded-sm transform rotate-45"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                        <p className="text-gray-500 text-xs">Adet: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ₺{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam ({totalItems} ürün)</span>
                  <span className="text-gray-900">₺{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">KDV (%18)</span>
                  <span className="text-gray-900">₺{(totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span className="text-gray-900">Toplam</span>
                  <span className="text-gray-900">₺{(totalAmount * 1.18).toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
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