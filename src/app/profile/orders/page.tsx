'use client';

import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const orders = [
  {
    id: 'ORD-1001',
    date: '2024-06-01',
    total: 599.99,
    status: 'Teslim Edildi',
    items: 2
  },
  {
    id: 'ORD-1002',
    date: '2024-05-20',
    total: 299.99,
    status: 'Kargoda',
    items: 1
  }
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim</h1>
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Henüz siparişiniz yok</h2>
            <p className="text-gray-500 mb-6">Alışverişe başlamak için ürünleri inceleyin.</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{order.id}</div>
                  <div className="text-gray-500 text-sm">{order.date}</div>
                  <div className="text-gray-500 text-sm">{order.items} ürün</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="font-bold text-gray-900 text-lg">₺{order.total.toFixed(2)}</div>
                  <div className="text-sm text-green-600 font-semibold">{order.status}</div>
                  <Link href={`/profile/orders/${order.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
                    Detay <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 