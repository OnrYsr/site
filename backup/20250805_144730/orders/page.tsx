'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingBag, ArrowRight, Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: Array<{ id: string; quantity: number }>;
}

const statusConfig = {
  PENDING: { label: 'Beklemede', icon: Clock, color: 'text-yellow-600' },
  CONFIRMED: { label: 'Onaylandı', icon: CheckCircle, color: 'text-blue-600' },
  PROCESSING: { label: 'Hazırlanıyor', icon: Package, color: 'text-orange-600' },
  SHIPPED: { label: 'Kargoda', icon: Truck, color: 'text-purple-600' },
  DELIVERED: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600' },
  CANCELLED: { label: 'İptal Edildi', icon: XCircle, color: 'text-red-600' },
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">#{order.orderNumber}</div>
                    <div className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-gray-500 text-sm">{totalItems} ürün</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="font-bold text-gray-900 text-lg">₺{order.totalAmount.toFixed(2)}</div>
                    <div className={`text-sm font-semibold inline-flex items-center gap-1 ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                    <Link href={`/profile/orders/${order.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
                      Detay <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 