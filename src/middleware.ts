import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Basic CSP; adjust hashes/nonces as needed for inline styles/scripts
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval'", // Next in dev; tighten in prod
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: ipfs.io",
    "connect-src 'self' https://starknet.api.avnu.fi https://api.pinata.cloud " + (process.env.NEXT_PUBLIC_BACKEND_URL || '') ,
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};

