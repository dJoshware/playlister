import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getCurrentUser, getValidAccessToken } from "@/lib/spotify";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const metadata: Metadata = {
    title: "Playlister",
    description: "A smoother way to customize your Spotify playlists.",
    icons: {
        apple: [
            { url: "/playlister-logo-192.png", sizes: "192x192" },
            { url: "/playlister-logo-512.png", sizes: "512x512" },
        ],
    },
};

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = await getValidAccessToken();
    const user = await getCurrentUser(token);
    const username: string = user?.display_name || "User";
    const avatar: string = user?.images?.[0]?.url ?? "";
    const initial = username.charAt(0).toUpperCase();

    return (
        <div className='min-h-screen flex flex-col bg-background text-foreground'>
            {/* Navbar */}
            <header className='sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm'>
                <div className='mx-auto max-w-6xl px-4 h-16 flex items-center justify-between'>
                    <Link
                        href='/dashboard'
                        className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                        <svg
                            viewBox='0 0 24 24'
                            fill='currentColor'
                            className='w-6 h-6 text-primary'>
                            <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
                        </svg>
                        <span className='font-bold text-lg tracking-tight'>
                            Playlister
                        </span>
                    </Link>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className='flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary'>
                                <span className='text-sm text-muted-foreground hidden sm:block'>
                                    {username}
                                </span>
                                <div className='w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-transparent hover:ring-primary transition-all'>
                                    {avatar ? (
                                        <Image
                                            src={avatar}
                                            alt={username}
                                            width={36}
                                            height={36}
                                            className='object-cover'
                                        />
                                    ) : (
                                        <span className='text-sm font-semibold'>
                                            {initial}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align='end'
                                sideOffset={8}
                                className='z-50 min-w-[140px] rounded-lg border border-border bg-card p-1 shadow-xl animate-in fade-in-0 zoom-in-95'>
                                <DropdownMenu.Item asChild>
                                    <a
                                        href='/api/auth/logout'
                                        className='block w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer outline-none'>
                                        Sign out
                                    </a>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </header>

            <main className='flex-1 mx-auto w-full max-w-6xl px-4 py-8'>
                {children}
            </main>

            <footer className='border-t border-border py-5 text-center text-xs text-muted-foreground'>
                Powered by{" "}
                <a
                    href='https://open.spotify.com'
                    target='_blank'
                    rel='noreferrer'
                    className='text-primary hover:underline'>
                    Spotify
                </a>
            </footer>
        </div>
    );
}
