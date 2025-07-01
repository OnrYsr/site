'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

const users = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Admin', isActive: true },
  { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', role: 'Kullanıcı', isActive: true },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', role: 'Kullanıcı', isActive: false },
];

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Adı</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">E-posta</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Rol</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Durum</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-gray-700">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                    <Edit className="w-4 h-4" /> Düzenle
                  </button>
                  <button className="text-red-600 hover:underline flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 