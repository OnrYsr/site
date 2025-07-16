'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, AlertCircle, Users, Package, Eye } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  productCount: number;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentId: '',
    displayOrder: 0,
    isActive: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
      fetchCategories();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      const data = await response.json();

      if (data.success) {
        const categoryData = data.data;
        setCategory(categoryData);
        setFormData({
          name: categoryData.name,
          description: categoryData.description || '',
          image: categoryData.image || '',
          parentId: categoryData.parentId || '',
          displayOrder: categoryData.displayOrder || 0,
          isActive: categoryData.isActive
        });
      } else {
        setErrors({ general: 'Kategori bulunamadı' });
      }
    } catch (err) {
      console.error('Category fetch error:', err);
      setErrors({ general: 'Kategori yüklenirken hata oluştu' });
    } finally {
      setPageLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        // Only show main categories (no parentId) as potential parents, excluding current category
        const mainCategories = data.data.filter((cat: Category) => 
          !cat.parentId && cat.id !== categoryId
        );
        setCategories(mainCategories);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    }

    if (formData.parentId === categoryId) {
      newErrors.parentId = 'Kategori kendisinin alt kategorisi olamaz';
    }

    if (formData.displayOrder < 0 || formData.displayOrder > 999) {
      newErrors.displayOrder = 'Gösterim sırası 0-999 arasında olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          image: formData.image.trim() || null,
          parentId: formData.parentId || null,
          displayOrder: parseInt(formData.displayOrder.toString()) || 0,
          isActive: formData.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Kategori başarıyla güncellendi!');
        // Refresh category data
        await fetchCategory();
      } else {
        setErrors({ general: data.error || 'Kategori güncellenemedi' });
      }
    } catch (error) {
      console.error('Update category error:', error);
      setErrors({ general: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Kategori bulunamadı
        </div>
        <Link 
          href="/admin/categories"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Kategorilere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/admin/categories"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kategorilere Dön
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategori Düzenle</h1>
            <p className="text-gray-600 mt-2">
              {category.parent && (
                <span className="text-blue-600">
                  {category.parent.name} →{' '}
                </span>
              )}
              {category.name} kategorisini düzenleyin
            </p>
          </div>
          <Link
            href={`/products?category=${category.slug}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Önizle
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`admin-input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Kategori adını girin"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Üst Kategori
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className={`admin-select ${errors.parentId ? 'border-red-500' : ''}`}
                >
                  <option value="">Ana Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.parentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  {category.parent ? 
                    `Şu anda "${category.parent.name}" kategorisinin alt kategorisi` : 
                    'Şu anda ana kategori'
                  }
                </p>
              </div>

              {/* Display Order */}
              <div>
                <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
                  Gösterim Sırası *
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  className={`admin-input ${errors.displayOrder ? 'border-red-500' : ''}`}
                  placeholder="Gösterim sırasını girin (0-999)"
                  min="0"
                  max="999"
                  required
                />
                {errors.displayOrder && (
                  <p className="text-red-500 text-sm mt-1">{errors.displayOrder}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Küçük sayılar önce görünür (0, 1, 2...)
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="admin-textarea"
                  placeholder="Kategori açıklamasını girin (opsiyonel)"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel URL'si
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="https://example.com/image.jpg (opsiyonel)"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Kategori aktif olsun
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                </button>
                
                <Link
                  href="/admin/categories"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  İptal
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Category Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori İstatistikleri</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Ürün Sayısı</div>
                  <div className="font-semibold">{category.productCount}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Alt Kategori Sayısı</div>
                  <div className="font-semibold">{category.subcategories.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subcategories */}
          {category.subcategories.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alt Kategoriler</h3>
              <div className="space-y-3">
                {category.subcategories.map(subcategory => (
                  <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{subcategory.name}</span>
                    <span className="text-sm text-gray-500">{subcategory.productCount} ürün</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Hierarchy */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Hiyerarşisi</h3>
            <div className="space-y-2 text-sm">
              {category.parent ? (
                <div>
                  <span className="text-gray-500">Üst Kategori:</span>
                  <div className="font-medium text-blue-600 mt-1">{category.parent.name}</div>
                </div>
              ) : (
                <div className="text-gray-500">Ana kategori</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 