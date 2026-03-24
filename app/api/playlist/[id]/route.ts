import { NextResponse } from 'next/server';
import {
    getValidAccessToken,
    getPlaylist,
    getAllPlaylistTracks,
    updatePlaylist,
    deletePlaylist,
    addTracksToPlaylist,
    removeTracksFromPlaylist,
} from '@/lib/spotify';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const token = await getValidAccessToken();
        const [playlist, tracks] = await Promise.all([
            getPlaylist(token, id),
            getAllPlaylistTracks(token, id),
        ]);
        return NextResponse.json({ playlist, tracks });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const token = await getValidAccessToken();
        const { name, description, removeTrackIds, addTrackIds } =
            await request.json();
        if (name && description !== undefined)
            await updatePlaylist(token, id, name, description);
        if (removeTrackIds?.length)
            await removeTracksFromPlaylist(token, id, removeTrackIds);
        if (addTrackIds?.length)
            await addTracksToPlaylist(token, id, addTrackIds);
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const token = await getValidAccessToken();
        await deletePlaylist(token, id);
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
