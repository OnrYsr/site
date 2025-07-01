'use client';

import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { id: 1, name: 'Mimari Modeller', isActive: true },
  { id: 2, name: 'Karakter Modelleri', isActive: true },
  { id: 3, name: 'Araç Modelleri', isActive: false },
];

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Yeni Kategori
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Adı</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {category.isActive ? 'Aktif' : 'Pasif'}
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