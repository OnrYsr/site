'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Shield, Clock, Settings } from 'lucide-react';
import AuthBackground from '@/components/ui/AuthBackground';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface RateLimitInfo {
  isBlocked: boolean;
  blockType: 'IP' | 'EMAIL' | null;
  resetTime: number;
  remainingAttempts?: number;
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    isBlocked: false,
    blockType: null,
    resetTime: 0
  });
  const router = useRouter();
  const settings = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNotRobot) {
      setMessage({ type: 'error', text: 'Robot olmadığınızı doğrulayın' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...' });
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        if (data.rateLimit) {
          setRateLimit(data.rateLimit);
        }
        setMessage({ type: 'error', text: data.error || 'Kayıt sırasında bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası oluştu' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getTimeRemaining = () => {
    const now = Date.now();
    const remaining = Math.max(0, rateLimit.resetTime - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Eğer kayıt kapalıysa, kapalı sayfasını göster
  if (!settings.registrationEnabled) {
    return (
      <AuthBackground>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kayıt Kapalı</h1>
            <p className="text-gray-600">Şu anda yeni kayıtlar alınmamaktadır.</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Giriş Sayfasına Git
            </Link>
            
            <Link
              href="/"
              className="block text-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hesap Oluştur</h1>
          <p className="text-gray-600">{settings.siteDescription}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adınız ve soyadınız"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          {/* Password Field */}
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
                required
                value={form.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="En az 6 karakter"
                minLength={6}
              />
            </div>
          </div>

          {/* Rate Limit Warning */}
          {rateLimit.isBlocked && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-800">
                  {rateLimit.blockType === 'IP' ? 'IP Adresiniz' : 'E-posta Adresiniz'} Geçici Olarak Engellendi
                </span>
              </div>
              <p className="text-sm text-red-700">
                Çok fazla deneme yaptınız. {getTimeRemaining()} sonra tekrar deneyebilirsiniz.
              </p>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`rounded-lg p-4 flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Not Robot Checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="notRobot"
              type="checkbox"
              checked={isNotRobot}
              onChange={(e) => setIsNotRobot(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notRobot" className="text-sm text-gray-700">
              Robot olmadığımı doğruluyorum
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || rateLimit.isBlocked}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Kayıt Oluşturuluyor...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Kayıt Ol
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-800">Güvenlik</span>
          </div>
          <p className="text-sm text-blue-700">
            Bilgileriniz güvenli şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
} 