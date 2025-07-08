'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Kategorileri yükle
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Kategoriler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
      setError('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Kategori sil
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchCategories(); // Listeyi yenile
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      console.error('Delete category error:', err);
      setMessage({ type: 'error', text: 'Kategori silinirken hata oluştu' });
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Mesajları otomatik temizle
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchCategories}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
        <Link href="/admin/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Yeni Kategori
        </Link>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Adı</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Slug</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Ürün Sayısı</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Henüz kategori eklenmemiş.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{category.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{category.productCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      category.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {category.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link 
                        href={`/admin/categories/${category.id}/edit`} 
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <Edit className="w-4 h-4" /> Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={deleteLoading === category.id}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm disabled:opacity-50"
                      >
                        {deleteLoading === category.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Toplam {categories.length} kategori bulunuyor
        </div>
      )}
    </div>
  );
} 