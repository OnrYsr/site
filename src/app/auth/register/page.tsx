'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Shield, Clock } from 'lucide-react';

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
              resetTime: 0
            });
            setMessage(null);
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage(null); // Clear message when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow submission if blocked
    if (rateLimit.isBlocked) {
      return;
    }
    
    // Check anti-bot checkbox
    if (!isNotRobot) {
      setMessage({ type: 'error', text: 'Lütfen robot olmadığınızı onaylayın.' });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setForm({ name: '', email: '', password: '' });
        setIsNotRobot(false);
        
        // Reset any rate limiting on successful registration
        setRateLimit({
          isBlocked: false,
          blockType: null,
          resetTime: 0
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        // Handle rate limiting errors
        if (response.status === 429 && data.rateLimited) {
          const resetSeconds = Math.ceil((data.resetTime - Date.now()) / 1000);
          const blockType = data.reason === 'IP_BLOCKED' ? 'IP' : 'EMAIL';
          
          setRateLimit({
            isBlocked: true,
            blockType: blockType,
            resetTime: data.resetTime
          });
          setCountdown(resetSeconds);
          setMessage({ type: 'error', text: data.error });
        } else {
          setMessage({ type: 'error', text: data.error });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kayıt Ol</h1>
          <p className="text-gray-600 mt-2">Yeni hesap oluşturun</p>
        </div>
        
        {/* Rate Limit Warning */}
        {rateLimit.isBlocked && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 font-medium">Güvenlik Koruması Aktif</span>
            </div>
            <div className="text-red-700 text-sm mb-3">{message?.text}</div>
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
        
        {/* Regular Messages */}
        {message && !rateLimit.isBlocked && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isLoading || rateLimit.isBlocked}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Adınız ve soyadınız"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading || rateLimit.isBlocked}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="E-posta adresiniz"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading || rateLimit.isBlocked}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Şifreniz (en az 6 karakter)"
              />
            </div>
          </div>

          {/* Anti-Bot Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notRobot"
              checked={isNotRobot}
              onChange={(e) => setIsNotRobot(e.target.checked)}
              disabled={isLoading || rateLimit.isBlocked}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
            />
            <label htmlFor="notRobot" className="text-sm text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Ben robot değilim
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || rateLimit.isBlocked || !isNotRobot}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              isLoading || rateLimit.isBlocked || !isNotRobot
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kayıt Oluşturuluyor...
              </>
            ) : rateLimit.isBlocked ? (
              <>
                <Shield className="w-5 h-5" />
                Engellendi
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Kayıt Ol
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
} 