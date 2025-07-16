'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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

export default function AdminBannerEditPage() {
  const params = useParams();
  const router = useRouter();
  const bannerId = params.id as string;

  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Banner bilgilerini yükle
  useEffect(() => {
    const fetchBanner = async () => {
      if (!bannerId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/banners/${bannerId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Banner bulunamadı');
          } else {
            setError('Banner yüklenirken hata oluştu');
          }
          return;
        }

        const result = await response.json();
        
        if (!result.success || !result.data) {
          setError('Banner verileri alınamadı');
          return;
        }

        const bannerData = result.data;
        setBanner(bannerData);

        // Form verilerini güncelle
        setForm({
          title: bannerData.title,
          subtitle: bannerData.subtitle || '',
          image: bannerData.image,
          link: bannerData.link || '',
          type: bannerData.type || 'HERO',
          order: bannerData.order,
          isActive: bannerData.isActive,
          startDate: bannerData.startDate ? bannerData.startDate.split('T')[0] : '',
          endDate: bannerData.endDate ? bannerData.endDate.split('T')[0] : '',
        });

      } catch (error) {
        console.error('Banner yüklenirken hata:', error);
        setError('Banner yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bannerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setSaving(true);
    setError(null);

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

      const updateData = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        image: form.image.trim(),
        link: form.link.trim() || null,
        order: form.order,
        isActive: form.isActive,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const response = await fetch(`/api/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Banner güncellenirken hata oluştu');
      }

      router.push('/admin/banners');
    } catch (error) {
      console.error('Banner güncelleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Banner güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Banner yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/banners" className="text-blue-600 hover:underline">
          Banner listesine dön
        </Link>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Banner bulunamadı</p>
        <Link href="/admin/banners" className="text-blue-600 hover:underline">
          Banner listesine dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Düzenle</h1>
          <p className="text-gray-600 mt-1">"{banner.title}" banner'ını düzenliyorsunuz</p>
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
          disabled={saving}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Değişiklikleri Kaydet
            </>
          )}
        </button>
      </form>
    </div>
  );
} 