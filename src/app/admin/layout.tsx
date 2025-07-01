'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Image, Users, ShoppingBag, Settings } from 'lucide-react';

const menu = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Ürünler', href: '/admin/products', icon: Package },
  { label: 'Kategoriler', href: '/admin/categories', icon: Tag },
  { label: 'Bannerlar', href: '/admin/banners', icon: Image },
  { label: 'Siparişler', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Kullanıcılar', href: '/admin/users', icon: Users },
  { label: 'Ayarlar', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl font-bold text-blue-600">Admin Panel</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 text-xs text-gray-400">v1.0.0</div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <span className="font-semibold text-gray-700">Yönetim Paneli</span>
          <Link href="/" className="text-blue-600 hover:underline text-sm">Siteye Git</Link>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
} 