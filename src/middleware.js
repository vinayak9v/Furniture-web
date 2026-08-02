import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('adminToken')?.value;

  const path = request.nextUrl.pathname;
  const isDashboardRoute = path.startsWith('/admin/dashboard');
  const isLoginRoute = path === '/admin/login';

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/login',
  ],
};
