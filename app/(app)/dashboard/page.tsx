import Link from "next/link";
import Image from "next/image";
import { getValidAccessToken, getUserPlaylists } from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Plus } from "lucide-react";

export default async function DashboardPage() {
    const token = await getValidAccessToken();
    const data = await getUserPlaylists(token);
    const playlists: any[] = data?.items ?? [];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold tracking-tight'>
                    Your Library
                </h1>
                <Button
                    asChild
                    size='sm'>
                    <Link href='/create'>
                        <Plus className='w-4 h-4 mr-1.5' />
                        New Playlist
                    </Link>
                </Button>
            </div>

            {playlists.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 gap-4 text-center'>
                    <Music className='w-12 h-12 text-muted-foreground' />
                    <p className='text-muted-foreground'>
                        No playlists yet. Create your first one!
                    </p>
                    <Button asChild>
                        <Link href='/create'>Create Playlist</Link>
                    </Button>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {playlists.map((playlist: any) => (
                        <Link
                            key={playlist.id}
                            href={`/playlist/${playlist.id}`}>
                            <Card className='group hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden border-border/50'>
                                <CardContent className='p-0'>
                                    <div className='relative aspect-square bg-muted'>
                                        {playlist.images?.[0]?.url ? (
                                            <Image
                                                src={playlist.images[0].url}
                                                alt={playlist.name}
                                                fill
                                                className='object-cover'
                                                sizes='(max-width: 640px) 50vw, 25vw'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center'>
                                                <Music className='w-10 h-10 text-muted-foreground' />
                                            </div>
                                        )}
                                    </div>
                                    <div className='p-3'>
                                        <p className='text-sm font-medium truncate'>
                                            {playlist.name}
                                        </p>
                                        <p className='text-xs text-muted-foreground mt-0.5'>
                                            {playlist.tracks?.total ?? 0} tracks
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
