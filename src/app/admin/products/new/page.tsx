'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const initialForm = {
  name: '',
  price: '',
  originalPrice: '',
  stock: '',
  categoryId: '',
  images: '',
  description: '',
  isActive: true,
  isSaleActive: true,
  isFeatured: false,
};

export default function AdminProductNewPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        // Tüm kategorileri (ana + alt) getir
        const allCategories: Category[] = [];
        data.data.forEach((mainCat: any) => {
          allCategories.push({
            id: mainCat.id,
            name: mainCat.name,
            slug: mainCat.slug
          });
          mainCat.subcategories.forEach((subCat: any) => {
            allCategories.push({
              id: subCat.id,
              name: `${mainCat.name} > ${subCat.name}`,
              slug: subCat.slug
            });
          });
        });
        setCategories(allCategories);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u') 
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasyon
    if (!form.name.trim()) {
      setError('Ürün adı gereklidir');
      return;
    }
    if (!form.categoryId) {
      setError('Kategori seçilmelidir');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError('Geçerli bir fiyat girilmelidir');
      return;
    }
    if (!form.stock || Number(form.stock) < 0) {
      setError('Geçerli bir stok miktarı girilmelidir');
      return;
    }

    try {
      setLoading(true);

      // İmajları array'e çevir
      const imageArray = form.images 
        ? form.images.split(',').map(img => img.trim()).filter(img => img)
        : [];

      const productData = {
        name: form.name.trim(),
        slug: generateSlug(form.name.trim()),
        description: form.description.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        images: imageArray,
        stock: Number(form.stock),
        isActive: form.isActive,
        isSaleActive: form.isSaleActive,
        isFeatured: form.isFeatured,
        categoryId: form.categoryId,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Ürün başarıyla eklendi!');
        router.push('/admin/products');
      } else {
        setError(data.error || 'Ürün eklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Ürün eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
        <Link href="/admin/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ürün adı"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ürün açıklaması"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">Eski Fiyat (₺)</label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="İndirimli fiyat için"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Stok miktarı"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
            {categoriesLoading ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                <div className="animate-pulse">Kategoriler yükleniyor...</div>
              </div>
            ) : (
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Kategori seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">Görsel URL'leri</label>
          <input
            type="text"
            id="images"
            name="images"
            value={form.images}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Görsel URL'leri virgül ile ayırın"
          />
          <p className="text-xs text-gray-500 mt-1">Birden fazla görsel için URL'leri virgül ile ayırın</p>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isSaleActive"
              name="isSaleActive"
              checked={form.isSaleActive}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="isSaleActive" className="text-sm text-gray-700">Satışa Açık</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-700">Öne Çıkan</label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || categoriesLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Ürün Ekle
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 