'use client';

import { Eye } from 'lucide-react';
import Link from 'next/link';

const orders = [
  { id: 'ORD-1001', date: '2024-06-01', total: 599.99, status: 'Teslim Edildi', user: 'Ahmet Yılmaz' },
  { id: 'ORD-1002', date: '2024-05-20', total: 299.99, status: 'Kargoda', user: 'Ayşe Demir' },
];

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Sipariş No</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Kullanıcı</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Tarih</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Tutar</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-gray-700">{order.user}</td>
                <td className="px-6 py-4 text-gray-700">{order.date}</td>
                <td className="px-6 py-4 text-gray-700">₺{order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'Teslim Edildi' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 