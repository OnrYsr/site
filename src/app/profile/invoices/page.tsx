'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';

const invoices = [
  {
    id: 'INV-1001',
    date: '2024-06-01',
    total: 599.99,
    status: 'Ödendi',
    downloadUrl: '#'
  },
  {
    id: 'INV-1002',
    date: '2024-05-20',
    total: 299.99,
    status: 'Beklemede',
    downloadUrl: '#'
  }
];

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Faturalarım</h1>
        {invoices.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Henüz faturanız yok</h2>
            <p className="text-gray-500 mb-6">Alışveriş yaptıkça faturalarınız burada görünecek.</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{invoice.id}</div>
                  <div className="text-gray-500 text-sm">{invoice.date}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="font-bold text-gray-900 text-lg">₺{invoice.total.toFixed(2)}</div>
                  <div className={`text-sm font-semibold ${invoice.status === 'Ödendi' ? 'text-green-600' : 'text-yellow-600'}`}>{invoice.status}</div>
                  <a href={invoice.downloadUrl} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm" download>
                    İndir
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 