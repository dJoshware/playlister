import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthHeader, REDIRECT_URI } from '@/lib/spotify';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = request.cookies.get('oauth_state')?.value;

    if (searchParams.get('error') || !code)
        return NextResponse.redirect(
            new URL('/login?error=access_denied', request.url),
        );
    if (!state || state !== storedState)
        return NextResponse.redirect(
            new URL('/login?error=state_mismatch', request.url),
        );

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: getAuthHeader(),
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        }),
    });

    if (!tokenRes.ok)
        return NextResponse.redirect(
            new URL('/login?error=token_exchange', request.url),
        );

    const data = await tokenRes.json();
    const res = NextResponse.redirect(new URL('/dashboard', request.url));

    res.cookies.set(
        'spotify_tokens',
        JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + data.expires_in * 1000,
        }),
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        },
    );
    res.cookies.delete('oauth_state');
    return res;
}
