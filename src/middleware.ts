// ============================================
// GS SPORT - Middleware
// Sets auth + cache-control on every page response
// ============================================

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // ── Prevent browsers from caching page HTML ──
  // Content-hashed static assets are excluded by the matcher below,
  // so this only applies to HTML page responses.
  // Without this, the browser may serve stale HTML that references
  // JS chunks from a previous build → 404 → white screen.
  if (!response.headers.has('Cache-Control')) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  // Identify the build so we can trace stale-content issues
  response.headers.set('X-Build-Time', process.env.NEXT_PUBLIC_BUILD_TIME || 'dev');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (static files — content-hashed, cached immutably)
     * - favicon.ico, images, fonts
     * - api/ routes (they handle their own caching)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)',
  ],
};
