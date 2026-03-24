import { NextResponse } from 'next/server';
import {
    getValidAccessToken,
    getUserPlaylists,
    getCurrentUser,
    createPlaylist,
} from '@/lib/spotify';

export async function GET() {
    try {
        const token = await getValidAccessToken();
        const [playlists, user] = await Promise.all([
            getUserPlaylists(token),
            getCurrentUser(token),
        ]);
        return NextResponse.json({ playlists, user });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const token = await getValidAccessToken();
        const user = await getCurrentUser(token);
        const { name, description, isPublic, collaborative } =
            await request.json();
        if (isPublic && collaborative)
            return NextResponse.json(
                { error: 'Collaborative playlists must be private.' },
                { status: 400 },
            );
        const playlist = await createPlaylist(
            token,
            user.id,
            name,
            description,
            isPublic,
            collaborative,
        );
        return NextResponse.json(playlist);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
