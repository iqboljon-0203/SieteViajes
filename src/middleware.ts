
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host');

  // Skip middleware for internal Next.js requests and static files
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') || // matches common static files like .png, .svg, etc.
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Subdomain Logic: If host is admin.something.com or adminka.something.com
  if (hostname && (hostname.startsWith('admin.') || hostname.startsWith('adminka.'))) {
    // Check if the current internal path already starts with /admin
    if (!url.pathname.startsWith('/admin')) {
      const rewrittenUrl = req.nextUrl.clone();
      rewrittenUrl.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(rewrittenUrl);
    }
  }

  return NextResponse.next();
}

// Match all paths except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
