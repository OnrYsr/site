'use client';

import { Package, Tag, Image, Users, ShoppingBag, Settings } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Ürünler', value: 128, icon: Package, href: '/admin/products' },
  { label: 'Kategoriler', value: 12, icon: Tag, href: '/admin/categories' },
  { label: 'Bannerlar', value: 4, icon: Image, href: '/admin/banners' },
  { label: 'Siparişler', value: 56, icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Kullanıcılar', value: 320, icon: Users, href: '/admin/users' },
  { label: 'Site Ayarları', value: '⚙️', icon: Settings, href: '/admin/settings' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:bg-blue-50 transition-colors">
            <stat.icon className="w-10 h-10 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hoşgeldiniz!</h2>
        <p className="text-gray-600">
          Bu panelden ürün, kategori, banner, sipariş, kullanıcı yönetimi ve site ayarlarını gerçekleştirebilirsiniz.
        </p>
      </div>
    </div>
  );
} 