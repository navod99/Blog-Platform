import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  if (!token && !isAuthPage && 
      (request.nextUrl.pathname.startsWith('/dashboard') || 
       request.nextUrl.pathname.startsWith('/posts/new') ||
       request.nextUrl.pathname.startsWith('/posts/edit'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/new', '/posts/edit/:path*', '/login', '/register'],
};