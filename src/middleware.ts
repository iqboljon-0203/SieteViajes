
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host');

  // Subdomain Logic: If host is admin.something.com or adminka.something.com
  if (hostname && (hostname.startsWith('admin.') || hostname.startsWith('adminka.'))) {
    // Check if the current internal path already starts with /admin
    // (This prevents infinite loops if the user actually goes to admin.domain.com/admin)
    if (!url.pathname.startsWith('/admin')) {
      // Rewrite the URL to point to the /admin folder
      // Example: admin.sieteviajes.com/tours -> sieteviajes.com/admin/tours
      const newPath = `/admin${url.pathname === '/' ? '' : url.pathname}`;
      
      // We return a rewrite (client doesn't see URL change in bar, but server shows /admin)
      return NextResponse.rewrite(new URL(newPath, req.url));
    }
  }

  return NextResponse.next();
}

// Match all paths except static assets and api
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};
