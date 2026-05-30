import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'sw'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  // e.g. incoming request is /builder
  // The new URL is now /en/builder
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and public folder images like /logos
    '/((?!_next|api|logos|logo.png|favicon.ico|hero_cv_.*).*)',
  ],
};
