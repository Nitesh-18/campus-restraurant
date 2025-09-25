// app/RootProviders.tsx
'use client'; // client component

import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@/lib/supabase-browser';
import { CartProvider } from '@/hooks/useCart';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pb-20">{children}</main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{ duration: 4000, className: 'text-sm' }}
        />
      </CartProvider>
    </SessionContextProvider>
  );
}
