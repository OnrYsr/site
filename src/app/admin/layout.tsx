'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Tag, Image, Users, ShoppingBag, Settings, LogOut, User, Loader2, LogIn } from 'lucide-react';

const menu = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Ürünler', href: '/admin/products', icon: Package },
  { label: 'Kategoriler', href: '/admin/categories', icon: Tag },
  { label: 'Bannerlar', href: '/admin/banners', icon: Image },
  { label: 'Siparişler', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Kullanıcılar', href: '/admin/users', icon: Users },
  { label: 'Ayarlar', href: '/admin/settings', icon: Settings },
];

// Login Component
function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState<{
    isBlocked: boolean;
    blockType: 'IP' | 'EMAIL' | null;
    resetMinutes: number;
  }>({
    isBlocked: false,
    blockType: null,
    resetMinutes: 0
  });
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for blocked users
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (rateLimit.isBlocked && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Reset rate limit when countdown reaches 0
            setRateLimit({
              isBlocked: false,
              blockType: null,
              resetMinutes: 0
            });
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rateLimit.isBlocked, countdown]);

  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow submission if blocked
    if (rateLimit.isBlocked) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Parse rate limiting errors
        if (result.error.includes('IP_BLOCKED:')) {
          const minutes = parseInt(result.error.split(':')[1]);
          setRateLimit({
            isBlocked: true,
            blockType: 'IP',
            resetMinutes: minutes
          });
          setCountdown(minutes * 60);
          setError(`IP adresiniz ${minutes} dakika boyunca engellendi. Çok fazla başarısız deneme yapıldı.`);
        } else if (result.error.includes('EMAIL_BLOCKED:')) {
          const minutes = parseInt(result.error.split(':')[1]);
          setRateLimit({
            isBlocked: true,
            blockType: 'EMAIL',
            resetMinutes: minutes
          });
          setCountdown(minutes * 60);
          setError(`Bu email adresi için ${minutes} dakika boyunca giriş engellendi. Çok fazla başarısız deneme yapıldı.`);
        } else {
          setError('Geçersiz email veya şifre');
        }
      } else if (result?.ok) {
        // Reset any rate limiting on successful login
        setRateLimit({
          isBlocked: false,
          blockType: null,
          resetMinutes: 0
        });
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Girişi</h1>
          <p className="text-gray-600 mt-2">Yönetici paneline erişim</p>
        </div>

        {/* Rate Limit Warning */}
        {rateLimit.isBlocked && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 text-red-600 flex-shrink-0">🛡️</div>
              <span className="text-red-700 font-medium">Güvenlik Koruması Aktif</span>
            </div>
            <div className="text-red-700 text-sm mb-3">{error}</div>
            {countdown > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-4 h-4">⏰</div>
                <span className="text-sm font-mono">
                  Kalan süre: {formatCountdown(countdown)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Regular Error Messages */}
        {error && !rateLimit.isBlocked && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 text-red-600 flex-shrink-0">⚠️</div>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || rateLimit.isBlocked}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">🔒</div>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || rateLimit.isBlocked}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || rateLimit.isBlocked}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Giriş yapılıyor...
              </>
            ) : rateLimit.isBlocked ? (
              <>
                <div className="w-5 h-5">🛡️</div>
                Engellendi
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Admin Girişi
              </>
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 text-xs">
            <div className="w-4 h-4">🛡️</div>
            <span>
              Admin Güvenlik: 5 yanlış deneme sonrası IP engeli, 3 yanlış deneme sonrası email engeli
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Layout
function AdminDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin' });
  };

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
        
        {/* User Info & Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-600 mb-3">
            👤 {session?.user?.name || session?.user?.email}
          </div>
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <div className="w-4 h-4">🌐</div>
              Siteye Git
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-3">v1.0.0</div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <AdminLogin />;
  }

  // Not admin
  if (session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erişim Reddedildi
          </h1>
          <p className="text-gray-600 mb-6">
            Bu alana erişim yetkiniz bulunmamaktadır. Sadece yöneticiler admin paneline erişebilir.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ana Sayfaya Dön
            </button>
            <div className="text-sm text-gray-500">
              Kullanıcı: {session.user?.email} ({session.user?.role})
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin user - show dashboard
  return <AdminDashboard>{children}</AdminDashboard>;
} 