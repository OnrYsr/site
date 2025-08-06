'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, User, Shield, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  orders: Array<{ id: string }>;
}

const roleConfig = {
  ADMIN: { label: 'Admin', icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  USER: { label: 'Kullanıcı', icon: User, color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Kullanıcılar yüklenirken hata oluştu');
      }
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Kullanıcılar yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Users fetch error:', err);
      setError('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kullanıcısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Kullanıcı silinirken hata oluştu');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== id));
        alert('Kullanıcı başarıyla silindi');
      } else {
        alert(data.error || 'Kullanıcı silinirken hata oluştu');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Kullanıcı silinirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchUsers}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar ({users.length})</h1>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-gray-500 mb-4">Henüz kullanıcı bulunmuyor</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Kullanıcı</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">E-posta</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Rol</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Kayıt Tarihi</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Sipariş Sayısı</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleInfo = roleConfig[user.role];
                const RoleIcon = roleInfo.icon;
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'İsimsiz Kullanıcı';

                return (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{fullName}</div>
                          <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${roleInfo.bgColor} ${roleInfo.color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {roleInfo.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                        {user.orders.length} sipariş
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/users/${user.id}`} 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(user.id, fullName)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 