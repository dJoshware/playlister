import { NextResponse } from 'next/server';
import {
    getValidAccessToken,
    searchArtistAlbums,
    getAlbumTracks,
} from '@/lib/spotify';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const albumId = searchParams.get('albumId');
    try {
        const token = await getValidAccessToken();
        if (albumId) {
            const songs = await getAlbumTracks(token, albumId);
            return NextResponse.json({ songs });
        }
        if (!query)
            return NextResponse.json(
                { error: 'Missing query' },
                { status: 400 },
            );
        const albums = await searchArtistAlbums(token, query);
        return NextResponse.json({ albums });
    } catch (err) {
        const msg = String(err);
        if (msg.includes('ARTIST_NOT_FOUND'))
            return NextResponse.json(
                {
                    error: "Artist not found. Please enter the artist's full name.",
                },
                { status: 404 },
            );
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
