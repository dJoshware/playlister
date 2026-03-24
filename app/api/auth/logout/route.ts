import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('spotify_tokens');
    return res;
}
