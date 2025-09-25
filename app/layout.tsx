// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import RootProviders from './RootProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Restaurant - Order Fresh Food',
  description:
    'Order delicious food from your campus restaurant with real-time updates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
