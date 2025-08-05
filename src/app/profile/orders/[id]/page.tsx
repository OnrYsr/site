'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrder();
    }
  }, [session, params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        console.error('Sipariş yüklenirken hata:', response.status);
        router.push('/profile/orders');
      }
    } catch (error) {
      console.error('Sipariş yüklenirken hata:', error);
      router.push('/profile/orders');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sipariş Bulunamadı</h1>
            <p className="text-gray-600 mb-6">Aradığınız sipariş bulunamadı veya erişim izniniz yok.</p>
            <button
              onClick={() => router.push('/profile/orders')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Siparişlerime Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const paymentInfo = paymentStatusConfig[order.paymentStatus];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h1>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sipariş #{order.orderNumber}</h2>
                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 ${paymentInfo.color}`}>
                  {paymentInfo.label}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Ürünleri</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-gray-500 text-sm">Adet: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">₺{item.price.toFixed(2)} / adet</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Toplam</span>
              <span className="text-2xl font-bold text-gray-900">₺{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Teslimat Adresi */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Teslimat Adresi</h3>
            <div className="space-y-2 text-gray-600">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
              {order.shippingAddress.phone && (
                <p>Tel: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>

          {/* Fatura Adresi */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fatura Adresi</h3>
            <div className="space-y-2 text-gray-600">
              <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
              <p>{order.billingAddress.address}</p>
              <p>{order.billingAddress.city} {order.billingAddress.postalCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 