'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/contexts/CartContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
} 