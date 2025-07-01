'use client';

import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

const banners = [
  { id: 1, title: 'Yaz İndirimi', isActive: true, order: 1 },
  { id: 2, title: 'Yeni Ürünler', isActive: false, order: 2 },
];

export default function AdminBannersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bannerlar</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Yeni Banner
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Başlık</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Sıra</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">{banner.title}</td>
                <td className="px-6 py-4 text-gray-700">{banner.order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {banner.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                    <Edit className="w-4 h-4" /> Düzenle
                  </button>
                  <button className="text-red-600 hover:underline flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 