'use client';

import Link from 'next/link';
import { User, Mail, LogOut, Settings, ShoppingBag, FileText, MapPin } from 'lucide-react';

const user = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  avatar: '',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profilim</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
          <p className="text-gray-600 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <Link href="/profile/settings" className="bg-gray-100 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Settings className="w-5 h-5" /> Hesap Ayarları
            </Link>
            <Link href="/profile/orders" className="bg-gray-100 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <ShoppingBag className="w-5 h-5" /> Siparişlerim
            </Link>
            <Link href="/profile/addresses" className="bg-gray-100 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <MapPin className="w-5 h-5" /> Adreslerim
            </Link>
            <Link href="/profile/invoices" className="bg-gray-100 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <FileText className="w-5 h-5" /> Faturalarım
            </Link>
          </div>
          <button className="mt-8 text-red-500 hover:underline flex items-center gap-2">
            <LogOut className="w-5 h-5" /> Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
} 