import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const tokens = request.cookies.get('spotify_tokens');
    const { pathname } = request.nextUrl;
    const isPublic =
        pathname.startsWith('/api/auth') ||
        pathname === '/login' ||
        pathname === '/';
    if (!tokens && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
