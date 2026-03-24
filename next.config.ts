import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.1.214'],
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'i.scdn.co' },
            { protocol: 'https', hostname: 'mosaic.scdn.co' },
            { protocol: 'https', hostname: 'image-cdn-ak.spotifycdn.com' },
            { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com' },
            { protocol: 'https', hostname: 'thisis-images.scdn.co' },
            { protocol: 'https', hostname: 'lineup-images.scdn.co' },
            { protocol: 'https', hostname: '*.spotifycdn.com' },
            { protocol: 'https', hostname: '*.scdn.co' },
        ],
    },
};

export default nextConfig;
