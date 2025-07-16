'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  type: 'HERO' | 'FEATURED_PRODUCTS';
  isActive: boolean;
  order: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners');
      const data = await response.json();

      if (data.success) {
        setBanners(data.data);
      } else {
        setError(data.error || 'Banner\'lar yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Banners fetch error:', err);
      setError('Banner\'lar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" banner'ını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setBanners(banners.filter(b => b.id !== id));
        alert('Banner başarıyla silindi');
      } else {
        alert(data.error || 'Banner silinirken hata oluştu');
      }
    } catch (err) {
      console.error('Delete banner error:', err);
      alert('Banner silinirken hata oluştu');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banners.find(b => b.id === id),
          isActive: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBanners(banners.map(b => 
          b.id === id ? { ...b, isActive: !currentStatus } : b
        ));
      } else {
        alert(data.error || 'Banner durumu güncellenirken hata oluştu');
      }
    } catch (err) {
      console.error('Toggle banner active error:', err);
      alert('Banner durumu güncellenirken hata oluştu');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Banner'lar</h1>
          <Link href="/admin/banners/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" /> Yeni Banner
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
          <h1 className="text-2xl font-bold text-gray-900">Banner'lar</h1>
          <Link href="/admin/banners/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" /> Yeni Banner
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchBanners}
            className="mt-2 text-red-600 hover:underline"
          >
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner'lar</h1>
          <p className="text-gray-600 mt-1">Toplam {banners.length} banner</p>
        </div>
        <Link href="/admin/banners/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Yeni Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz banner yok</h3>
          <p className="text-gray-600 mb-4">İlk banner'ınızı oluşturmak için başlayın</p>
          <Link href="/admin/banners/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Yeni Banner Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Banner</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Tip</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Sıra</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Başlangıç</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Bitiş</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        {banner.image ? (
                          <img 
                            src={banner.image} 
                            alt={banner.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-6 h-4 bg-gray-300 rounded"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{banner.title}</div>
                        {banner.subtitle && (
                          <div className="text-xs text-gray-500">{banner.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      banner.type === 'HERO' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {banner.type === 'HERO' ? 'Ana Sayfa' : 'Öne Çıkan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{banner.order}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(banner.id, banner.isActive)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {banner.isActive ? (
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
                  <td className="px-6 py-4 text-gray-700">{formatDate(banner.startDate)}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(banner.endDate)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/banners/${banner.id}/edit`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(banner.id, banner.title)}
                        disabled={deleteLoading === banner.id}
                        className="text-red-600 hover:underline flex items-center gap-1 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteLoading === banner.id ? 'Siliniyor...' : 'Sil'}
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