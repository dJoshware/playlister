"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

export default function CreatePlaylistPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [collaborative, setCollaborative] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please enter a playlist name.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/playlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    isPublic,
                    collaborative,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Failed to create playlist.");
                return;
            }
            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='max-w-lg mx-auto space-y-6'>
            <div className='flex items-center gap-3'>
                <Button
                    asChild
                    variant='ghost'
                    size='icon'>
                    <Link href='/dashboard'>
                        <ArrowLeft className='w-4 h-4' />
                    </Link>
                </Button>
                <h1 className='text-2xl font-bold tracking-tight'>
                    New Playlist
                </h1>
            </div>

            <Card className='border-border/50'>
                <CardHeader>
                    <CardTitle className='text-sm font-normal text-muted-foreground'>
                        Fill in the details for your new playlist.
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className='space-y-5'>
                        <div className='space-y-1.5'>
                            <label
                                htmlFor='name'
                                className='text-sm font-medium'>
                                Name *
                            </label>
                            <input
                                id='name'
                                type='text'
                                placeholder='My awesome playlist'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoComplete='off'
                                required
                                className='flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            />
                        </div>

                        <div className='space-y-1.5'>
                            <label
                                htmlFor='description'
                                className='text-sm font-medium'>
                                Description
                            </label>
                            <textarea
                                id='description'
                                placeholder='Describe your playlist...'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none'
                            />
                        </div>

                        <div className='space-y-3 pt-1'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium'>
                                        Public
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                        Anyone can find and listen
                                    </p>
                                </div>
                                <Switch.Root
                                    checked={isPublic}
                                    onCheckedChange={v => {
                                        setIsPublic(v);
                                        if (v) setCollaborative(false);
                                    }}
                                    className='relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                                    <Switch.Thumb className='pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0' />
                                </Switch.Root>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium'>
                                        Collaborative
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                        Others can add tracks (private only)
                                    </p>
                                </div>
                                <Switch.Root
                                    checked={collaborative}
                                    onCheckedChange={v => {
                                        setCollaborative(v);
                                        if (v) setIsPublic(false);
                                    }}
                                    className='relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                                    <Switch.Thumb className='pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0' />
                                </Switch.Root>
                            </div>
                        </div>

                        {error && (
                            <p className='text-sm text-destructive'>{error}</p>
                        )}

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                    Creating…
                                </>
                            ) : (
                                "Create Playlist"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
