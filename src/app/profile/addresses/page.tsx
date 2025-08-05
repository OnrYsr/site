'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  type: 'SHIPPING' | 'BILLING';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchAddresses();
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses');
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Adresler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
      }
    } catch (error) {
      console.error('Adres silinirken hata:', error);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/default`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchAddresses(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Varsayılan adres ayarlanırken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Adreslerim</h1>
          <button
            onClick={() => router.push('/profile/addresses/new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Adres Ekle
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz adres eklenmemiş</h3>
            <p className="text-gray-500 mb-4">İlk adresinizi ekleyerek alışverişe başlayabilirsiniz.</p>
            <button
              onClick={() => router.push('/profile/addresses/new')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Adresimi Ekle
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {address.firstName} {address.lastName}
                    </h3>
                    {address.isDefault && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                        Varsayılan
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/profile/addresses/${address.id}/edit`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  {address.company && (
                    <p className="text-sm">{address.company}</p>
                  )}
                  <p className="text-sm">{address.address1}</p>
                  {address.address2 && (
                    <p className="text-sm">{address.address2}</p>
                  )}
                  <p className="text-sm">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm">{address.country}</p>
                  {address.phone && (
                    <p className="text-sm">Tel: {address.phone}</p>
                  )}
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Varsayılan Yap
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 