'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminBannerNewPage() {
  const [form, setForm] = useState({
    title: '',
    image: '',
    link: '',
    order: 1,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Banner ekleme işlemi burada yapılacak
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Banner Ekle</h1>
        <Link href="/admin/banners" className="text-blue-600 hover:underline">Geri</Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
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
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Görsel bağlantısı"
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Bağlantı (isteğe bağlı)</label>
          <input
            type="text"
            id="link"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="admin-input"
            placeholder="Tıklanınca gidilecek adres"
          />
        </div>
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
          <input
            type="number"
            id="order"
            name="order"
            value={form.order}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Sıra"
            min={1}
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