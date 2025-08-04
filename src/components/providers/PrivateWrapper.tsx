'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface PrivateWrapperProps {
  children: React.ReactNode;
}

export default function PrivateWrapper({ children }: PrivateWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Auth sayfalarında kontrol yapma
    if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) {
      return;
    }

    // Session yüklenmeyi bekle
    if (status === 'loading') {
      return;
    }

    // Session yoksa doğrudan login'e yönlendir
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
  }, [session, status, router, pathname]);

  // Auth sayfaları - direkt render et  
  if (pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Session yüklenirken loading göster
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Session yoksa boş div döndür (yönlendirme useEffect'te yapılıyor)
  if (status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Yönlendiriliyor...</p>
      </div>
    </div>;
  }

  // Session varsa normal render
  return <>{children}</>;
} 