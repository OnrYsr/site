'use client';

import { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBannerNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    type: 'HERO' as 'HERO' | 'FEATURED_PRODUCTS',
    order: 0,
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' && 'checked' in e.target 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Form validation
      if (!form.title.trim()) {
        throw new Error('Banner başlığı gereklidir');
      }

      if (!form.image.trim()) {
        throw new Error('Banner görseli gereklidir');
      }

      if (form.order < 0) {
        throw new Error('Sıralama değeri 0 veya daha büyük olmalıdır');
      }

      // Date validation
      if (form.startDate && form.endDate) {
        const startDate = new Date(form.startDate);
        const endDate = new Date(form.endDate);
        
        if (startDate >= endDate) {
          throw new Error('Başlangıç tarihi bitiş tarihinden önce olmalıdır');
        }
      }

      const bannerData = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        image: form.image.trim(),
        link: form.link.trim() || null,
        type: form.type,
        order: form.order,
        isActive: form.isActive,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/banners');
      } else {
        setError(data.error || 'Banner oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Banner creation error:', error);
      setError(error instanceof Error ? error.message : 'Banner oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Banner Ekle</h1>
          <p className="text-gray-600 mt-1">Site ana sayfası için banner oluşturun</p>
        </div>
        <Link 
          href="/admin/banners" 
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Banner Başlığı */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Banner Başlığı *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Banner başlığı"
          />
        </div>

        {/* Alt Başlık */}
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
            Alt Başlık
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="admin-input"
            placeholder="Banner alt başlığı (opsiyonel)"
          />
        </div>

        {/* Banner Tipi */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Banner Tipi *
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="admin-input"
          >
            <option value="HERO">Ana Sayfa Banner'ı</option>
            <option value="FEATURED_PRODUCTS">Öne Çıkan Ürünler Banner'ı</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Banner'ın hangi alanda gösterileceğini seçin</p>
        </div>

        {/* Görsel URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Görsel URL *
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="https://example.com/banner-image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Banner görseli için geçerli bir URL girin</p>
        </div>

        {/* Link URL */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
            Link URL
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="admin-input"
            placeholder="https://example.com/target-page (opsiyonel)"
          />
          <p className="text-xs text-gray-500 mt-1">Banner tıklandığında yönlendirilecek sayfa</p>
        </div>

        {/* Sıralama */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
            Sıralama
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={form.order}
            onChange={handleChange}
            min="0"
            className="admin-input"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Düşük sayılar önce gösterilir</p>
        </div>

        {/* Tarih Aralığı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">Tarih aralığı belirtilmezse banner sürekli aktif olur</p>

        {/* Durum */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Banner aktif
          </label>
        </div>

        {/* Görsel Önizlemesi */}
        {form.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Önizleme</label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <img 
                src={form.image} 
                alt="Banner önizleme"
                className="max-w-full h-32 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Oluşturuluyor...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Banner Oluştur
            </>
          )}
        </button>
      </form>
    </div>
  );
} 