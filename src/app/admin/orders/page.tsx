'use client';

import { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{ quantity: number }>;
}

const statusConfig = {
  PENDING: { label: 'Beklemede', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  CONFIRMED: { label: 'Onaylandı', icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  PROCESSING: { label: 'Hazırlanıyor', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  SHIPPED: { label: 'Kargoda', icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  DELIVERED: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  CANCELLED: { label: 'İptal Edildi', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

const paymentStatusConfig = {
  PENDING: { label: 'Beklemede', color: 'text-yellow-600' },
  PAID: { label: 'Ödendi', color: 'text-green-600' },
  FAILED: { label: 'Başarısız', color: 'text-red-600' },
  REFUNDED: { label: 'İade Edildi', color: 'text-gray-600' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('Siparişler yüklenirken hata oluştu');
      }
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Siparişler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError('Siparişler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Sipariş durumu güncellenirken hata oluştu');
      }

      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        ));
      } else {
        alert(data.error || 'Sipariş durumu güncellenirken hata oluştu');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Sipariş durumu güncellenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchOrders}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Siparişler ({orders.length})</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-gray-500 mb-4">Henüz sipariş bulunmuyor</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Sipariş No</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Müşteri</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Tarih</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Tutar</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Ürün Sayısı</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Ödeme</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status];
                const paymentInfo = paymentStatusConfig[order.paymentStatus];
                const StatusIcon = statusInfo.icon;
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-gray-900">{order.user.firstName} {order.user.lastName}</div>
                        <div className="text-xs text-gray-500">{order.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">₺{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-700">{totalItems} ürün</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-semibold border-0 ${statusInfo.bgColor} ${statusInfo.color}`}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key} className="bg-white text-gray-900">
                              {config.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold bg-gray-100 ${paymentInfo.color}`}>
                        {paymentInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/orders/${order.id}`} 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Detay"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 