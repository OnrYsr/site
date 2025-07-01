'use client';

import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

const products = [
  { id: 1, name: 'Modern Ev Tasarımı', price: 299.99, stock: 10, category: 'Mimari Modeller', isActive: true },
  { id: 2, name: 'Futuristik Araba Modeli', price: 199.99, stock: 5, category: 'Araç Modelleri', isActive: false },
];

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Yeni Ürün
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Adı</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Kategori</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Fiyat</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Stok</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-gray-700">{product.category}</td>
                <td className="px-6 py-4 text-gray-700">₺{product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-700">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Edit className="w-4 h-4" /> Düzenle
                  </Link>
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