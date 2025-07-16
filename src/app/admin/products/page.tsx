'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Ürünler yüklenirken hata oluştu');
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || 'Ürünler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setError('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ürün silinirken hata oluştu');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
        alert('Ürün başarıyla silindi');
      } else {
        alert(data.error || 'Ürün silinirken hata oluştu');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Ürün silinirken hata oluştu');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Ürün durumu güncellenirken hata oluştu');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(products.map(p => 
          p.id === id ? { ...p, isActive: !currentStatus } : p
        ));
      } else {
        alert(data.error || 'Ürün durumu güncellenirken hata oluştu');
      }
    } catch (err) {
      console.error('Toggle active error:', err);
      alert('Ürün durumu güncellenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" /> Yeni Ürün
          </Link>
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
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" /> Yeni Ürün
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchProducts}
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
        <h1 className="text-2xl font-bold text-gray-900">Ürünler ({products.length})</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Yeni Ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-gray-500 mb-4">Henüz ürün eklenmemiş</div>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            İlk Ürünü Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Ürün</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Kategori</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Fiyat</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Stok</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Öne Çıkan</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{product.category.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">₺{product.price.toFixed(2)}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">₺{product.originalPrice.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.stock > 10 ? 'bg-green-100 text-green-700' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock} adet
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product.id, product.isActive)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                        product.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {product.isActive ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Pasif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.isFeatured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.isFeatured ? 'Evet' : 'Hayır'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/products/${product.id}/edit`} 
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 