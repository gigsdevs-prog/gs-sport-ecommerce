import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GS SPORT | Premium Athletic Wear',
    template: '%s | GS SPORT',
  },
  description: 'Premium athletic wear designed for those who demand excellence. Shop the latest in high-performance sportswear.',
  keywords: ['athletic wear', 'sportswear', 'premium', 'GS SPORT', 'fitness', 'activewear'],
  openGraph: {
    title: 'GS SPORT | Premium Athletic Wear',
    description: 'Elevate your game with GS SPORT premium athletic wear.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <Header />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a0a0a',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '0',
              padding: '14px 20px',
            },
          }}
        />
      </body>
    </html>
  );
}
