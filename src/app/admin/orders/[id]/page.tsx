'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const order = {
  id: 'ORD-1001',
  date: '2024-06-01',
  total: 599.99,
  status: 'Teslim Edildi',
  user: 'Ahmet Yılmaz',
  address: 'İstanbul, Türkiye',
  items: [
    { name: 'Modern Ev Tasarımı', price: 299.99, quantity: 1 },
    { name: 'Futuristik Araba Modeli', price: 299.99, quantity: 1 },
  ],
};

export default function AdminOrderDetailPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/admin/orders" className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Geri
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-700">{order.id}</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-200 transition-colors">
            <CheckCircle className="w-4 h-4" /> Teslim Edildi
          </button>
          <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-200 transition-colors">
            <XCircle className="w-4 h-4" /> İptal Et
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="text-lg font-bold text-gray-900 mb-2">Sipariş Bilgileri</div>
          <div className="text-gray-700 mb-1">Sipariş No: <span className="font-semibold">{order.id}</span></div>
          <div className="text-gray-700 mb-1">Kullanıcı: <span className="font-semibold">{order.user}</span></div>
          <div className="text-gray-700 mb-1">Tarih: <span className="font-semibold">{order.date}</span></div>
          <div className="text-gray-700 mb-1">Adres: <span className="font-semibold">{order.address}</span></div>
          <div className="text-gray-700 mb-1">Durum: <span className="font-semibold">{order.status}</span></div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 mb-2">Ürünler</div>
          <table className="min-w-full text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Ürün</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Adet</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-2 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-2 text-gray-700">₺{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end font-bold text-lg text-gray-900">
            Toplam: ₺{order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
} 