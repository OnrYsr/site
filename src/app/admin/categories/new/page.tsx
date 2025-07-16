'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        // Only show main categories (no parentId) as potential parents
        const mainCategories = data.data.filter((cat: Category & {parentId?: string}) => !cat.parentId);
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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          image: formData.image.trim() || null,
          displayOrder: parseInt(formData.displayOrder.toString()) || 0,
          parentId: formData.parentId || null,
          isActive: formData.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Kategori başarıyla oluşturuldu! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1500);
      } else {
        setErrors({ general: data.error || 'Kategori oluşturulamadı' });
      }
    } catch (error) {
      console.error('Create category error:', error);
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

  return (
    <div className="max-w-2xl mx-auto">
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
        <h1 className="text-3xl font-bold text-gray-900">Yeni Kategori</h1>
        <p className="text-gray-600 mt-2">Yeni bir kategori oluşturun</p>
      </div>

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

      {/* Form */}
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
              className="admin-select"
            >
              <option value="">Ana Kategori Olarak Oluştur</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-sm mt-1">
              Boş bırakırsanız ana kategori olarak oluşturulur
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
              {loading ? 'Oluşturuluyor...' : 'Kategori Oluştur'}
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
  );
} 