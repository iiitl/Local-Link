import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/home', '/commerce', '/emergency', '/profile', '/admin', '/dashboard', '/resources', '/skills', '/food'];
const PUBLIC_AUTH_PAGES = ['/login', '/auth', '/landing'];

function isTokenUnexpired(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Runtime-safe JWT payload decode for both Edge and Node runtimes.
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    let decoded = '';
    if (typeof atob === 'function') {
      decoded = atob(padded);
    } else if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(padded, 'base64').toString('utf8');
    } else {
      return false;
    }

    const payload = JSON.parse(decoded);
    if (!payload?.exp) return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowInSeconds;
  } catch (_error) {
    return false;
  }
}

async function isAuthenticated(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return false;
  return isTokenUnexpired(token);
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  console.log(`[MW] ${pathname} | token exists: ${!!token} | token length: ${token?.length || 0}`);
  if (token) {
    const valid = isTokenUnexpired(token);
    console.log(`[MW] token valid (unexpired): ${valid}`);
  }

  const loggedIn = token ? isTokenUnexpired(token) : false;

  // Root entrypoint: logged-in users land on home, guests land on landing.
  if (pathname === '/') {
    return NextResponse.redirect(new URL(loggedIn ? '/home' : '/landing', request.url));
  }

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => {
    if (prefix === '/') {
      return pathname === '/';
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });

  const isPublicAuthPage = PUBLIC_AUTH_PAGES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (loggedIn && isPublicAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!loggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search || ''}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login/:path*',
    '/auth/:path*',
    '/landing/:path*',
    '/home/:path*',
    '/commerce/:path*',
    '/emergency/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/resources/:path*',
    '/skills/:path*',
    '/food/:path*'
  ],
};
