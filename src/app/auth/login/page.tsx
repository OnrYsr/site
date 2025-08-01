'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Lock, Mail, LogIn, AlertCircle, Clock, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface RateLimitInfo {
  isBlocked: boolean;
  blockType: 'IP' | 'EMAIL' | null;
  resetMinutes: number;
  remainingAttempts?: number;
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    isBlocked: false,
    blockType: null,
    resetMinutes: 0
  });
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow submission if blocked
    if (rateLimit.isBlocked) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false, // Don't redirect automatically
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
        // Redirect all users to home page
        // Admin panel can be accessed separately via /admin URL
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Login exception:', err);
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
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Giriş Yap</h1>
          <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
        </div>

        {/* Rate Limit Warning */}
        {rateLimit.isBlocked && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 font-medium">Güvenlik Koruması Aktif</span>
            </div>
            <div className="text-red-700 text-sm mb-3">{error}</div>
            {countdown > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="w-4 h-4" />
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
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                disabled={loading || rateLimit.isBlocked}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                disabled={loading || rateLimit.isBlocked}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="••••••••"
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
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Giriş yapılıyor...
              </>
            ) : rateLimit.isBlocked ? (
              <>
                <Shield className="w-5 h-5" />
                Engellendi
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Giriş Yap
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 