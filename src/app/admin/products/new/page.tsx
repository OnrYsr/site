'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import Link from 'next/link';

const initialForm = {
  name: '',
  price: '',
  stock: '',
  category: '',
  image: '',
  description: '',
  isActive: true,
  discount: '',
  discountStart: '',
  discountEnd: '',
  badgeText: '',
  badgeColor: '#ff0000',
};

export default function AdminProductNewPage() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ürün ekleme işlemi burada yapılacak
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
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
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Görsel(ler) URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="admin-input"
            placeholder="Görsel URL (birden fazla için virgül ile ayırın)"
          />
          <p className="text-xs text-gray-500 mt-1">Birden fazla görsel eklemek için virgül ile ayırabilirsiniz.</p>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="admin-textarea"
            placeholder="Ürün açıklaması"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Fiyat"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Stok"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="admin-select"
          >
            <option value="">Kategori seçin</option>
            <option value="Mimari Modeller">Mimari Modeller</option>
            <option value="Karakter Modelleri">Karakter Modelleri</option>
            <option value="Araç Modelleri">Araç Modelleri</option>
            <option value="Mobilya Modelleri">Mobilya Modelleri</option>
            <option value="Elektronik Modeller">Elektronik Modeller</option>
            <option value="Doğa Modelleri">Doğa Modelleri</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">İndirim (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              min={0}
              max={100}
              className="admin-input"
              placeholder="İndirim yüzdesi"
            />
          </div>
          <div>
            <label htmlFor="badgeText" className="block text-sm font-medium text-gray-700 mb-2">Etiket (Badge) Metni</label>
            <input
              type="text"
              id="badgeText"
              name="badgeText"
              value={form.badgeText}
              onChange={handleChange}
              className="admin-input"
              placeholder="Etiket metni (örn. Yaz İndirimi)"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="discountStart" className="block text-sm font-medium text-gray-700 mb-2">İndirim Başlangıç</label>
            <input
              type="date"
              id="discountStart"
              name="discountStart"
              value={form.discountStart}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="discountEnd" className="block text-sm font-medium text-gray-700 mb-2">İndirim Bitiş</label>
            <input
              type="date"
              id="discountEnd"
              name="discountEnd"
              value={form.discountEnd}
              onChange={handleChange}
              className="admin-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="badgeColor" className="block text-sm font-medium text-gray-700 mb-2">Etiket Rengi</label>
          <input
            type="color"
            id="badgeColor"
            name="badgeColor"
            value={form.badgeColor}
            onChange={handleChange}
            className="w-12 h-12 p-0 border-0 bg-transparent"
          />
        </div>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Kaydet
        </button>
      </form>
    </div>
  );
} 