'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import FileUpload from '@/components/ui/FileUpload';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  parent?: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  categoryId: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    parent?: {
      name: string;
    };
  };
}

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    categoryId: '',
    images: [] as string[],
    isActive: true,
    isSaleActive: true,
    isFeatured: false,
  });

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setCategories(result.data);
          } else {
            console.error('Kategoriler yüklenirken hata:', result.error);
            setCategories([]);
          }
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Ürün bilgilerini yükle
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/products/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Ürün bulunamadı');
          } else {
            setError('Ürün yüklenirken hata oluştu');
          }
          return;
        }

        const result = await response.json();
        
        // API response formatını kontrol et
        if (!result.success || !result.data) {
          setError('Ürün verileri alınamadı');
          return;
        }

        const productData = result.data;
        setProduct(productData);

        // Form verilerini güncelle
        setForm({
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          originalPrice: productData.originalPrice || 0,
          stock: productData.stock,
          categoryId: productData.categoryId,
          images: productData.images || [],
          isActive: productData.isActive,
          isSaleActive: productData.isSaleActive ?? true,
          isFeatured: productData.isFeatured,
        });

      } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
        setError('Ürün yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const updateData = {
        name: form.name,
        description: form.description || null,
        price: form.price,
        originalPrice: form.originalPrice || null,
        stock: form.stock,
        categoryId: form.categoryId,
        images: form.images,
        isActive: form.isActive,
        isSaleActive: form.isSaleActive,
        isFeatured: form.isFeatured,
      };

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ürün güncellenirken hata oluştu');
      }

      // Başarılı güncelleme
      router.push('/admin/products');
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Ürün güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          Ürünler listesine dön
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Ürün bulunamadı</p>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          Ürünler listesine dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h1>
          <p className="text-gray-600 mt-1">"{product.name}" ürününü düzenliyorsunuz</p>
        </div>
        <Link 
          href="/admin/products" 
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

        {/* Ürün Adı */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Adı *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Ürün adı"
          />
        </div>

        {/* Açıklama */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="admin-textarea"
            placeholder="Ürün açıklaması"
          />
        </div>

        {/* Fiyat Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Satış Fiyatı (₺) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="admin-input"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Orijinal Fiyat (₺)
            </label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="admin-input"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">İndirimli satış için</p>
          </div>
        </div>

        {/* Stok */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
            Stok Adedi *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="admin-input"
            placeholder="0"
          />
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="admin-select"
          >
            <option value="">Kategori seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.parent ? `${category.parent.name} > ${category.name}` : category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Görseller */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Görselleri
          </label>
          <FileUpload
            category="products"
            multiple={true}
            maxFiles={5}
            initialFiles={form.images}
            onUpload={(uploadedFiles) => {
              const newUrls = uploadedFiles.map(file => file.fileUrl);
              setForm(prev => ({
                ...prev,
                images: [...prev.images, ...newUrls]
              }));
            }}
            onRemove={(fileUrl) => {
              setForm(prev => ({
                ...prev,
                images: prev.images.filter(url => url !== fileUrl)
              }));
            }}
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ürün görselleri yükleyin. Maksimum 5 adet görsel yükleyebilirsiniz.
          </p>
        </div>

        {/* Durum Seçenekleri */}
        <div className="space-y-3">
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
              Ürün aktif
            </label>
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
            <label htmlFor="isFeatured" className="text-sm text-gray-700">
              Öne çıkan ürün
            </label>
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
            <label htmlFor="isSaleActive" className="text-sm text-gray-700">
              Satışa açık <span className="text-green-600 text-xs">(Kapalıysa "Satışa Kapalı" görünür)</span>
            </label>
          </div>
        </div>

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