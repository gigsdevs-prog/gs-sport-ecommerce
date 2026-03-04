/** @type {import('next').NextConfig} */
const BUILD_TIME = new Date().toISOString();

const nextConfig = {
  // Deterministic build ID for cache-busting across deploys
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Expose build timestamp so middleware & client can trace stale content
  env: {
    NEXT_PUBLIC_BUILD_TIME: BUILD_TIME,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/drei', '@react-three/fiber'],
  },

  headers: async () => [
    // ── 1. HTML pages: NEVER cache in the browser ──
    // Browser must always revalidate with server/CDN.
    // Prevents stale HTML that references old JS chunk hashes.
    {
      source: '/((?!_next/|fonts/|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },

    // ── 2. Content-hashed JS/CSS chunks — safe forever ──
    // _next/static files include a hash in the filename;
    // a new deploy produces new hashes so old URLs are never reused.
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },

    // ── 3. Font files — immutable ──
    {
      source: '/fonts/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },

    // ── 4. Optimized images — moderate cache ──
    {
      source: '/_next/image/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
      ],
    },
  ],
};

export default nextConfig;
