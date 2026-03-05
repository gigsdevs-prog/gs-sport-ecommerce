import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SiteContentProvider } from '@/hooks/SiteContentProvider';
import { LanguageProvider } from '@/hooks/useLanguage';
import NavigationWrapper from '@/components/layout/NavigationWrapper';
import './globals.css';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), {
  ssr: false,
  loading: () => null,
});

const LiveChat = dynamic(() => import('@/components/chat/LiveChat'), {
  ssr: false,
  loading: () => null,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

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
      <head>
        <link rel="preconnect" href="https://nsupmxkzcwgdzyloyzog.supabase.co" />
        <link rel="dns-prefetch" href="https://nsupmxkzcwgdzyloyzog.supabase.co" />
      </head>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <LanguageProvider>
        <SiteContentProvider>
          <Header />
          <CartDrawer />
          <main className="min-h-screen"><NavigationWrapper>{children}</NavigationWrapper></main>
          <Footer />
          <LiveChat />
        </SiteContentProvider>
        </LanguageProvider>
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
