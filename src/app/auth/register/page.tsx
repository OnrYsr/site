'use client';

import Link from 'next/link';
import { UserPlus, Lock } from 'lucide-react';

// GEÇICI OLARAK KAPALI - Site geliştirme aşamasında
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
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
    </div>
  );
}

/* 
ORIGINAL REGISTER CODE - GEÇICI OLARAK YORUM SATIRINDA
Site açıldığında bu kısım geri alınacak

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

export default function RegisterPageOriginal() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    isBlocked: false,
    blockType: null,
    resetTime: 0
  });
  // ... rest of original code was here
}
*/ 