import { NextResponse } from 'next/server';
import { CLIENT_ID, REDIRECT_URI, SCOPE } from '@/lib/spotify';
import crypto from 'node:crypto';

export async function GET() {
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
        state,
        show_dialog: 'true',
    });
    const res = NextResponse.redirect(
        `https://accounts.spotify.com/authorize?${params}`,
    );
    res.cookies.set('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
    });
    return res;
}
