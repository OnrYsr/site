export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Sayfa Çalışıyor!
        </h1>
        <p className="text-gray-600 mb-6">
          Bu basit test sayfası gösteriliyor. Sunucu çalışıyor durumda.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>📅 {new Date().toLocaleDateString('tr-TR')}</p>
          <p>⏰ {new Date().toLocaleTimeString('tr-TR')}</p>
        </div>
      </div>
    </div>
  );
} 