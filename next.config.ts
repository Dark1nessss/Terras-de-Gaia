import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  // Required for self-hosted (cPanel/VPS) — bundles all dependencies into .next/standalone
  output: 'standalone',

  // Skip TS and ESLint checks during build — saves memory/threads on shared hosting
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    // Cache optimised images for 30 days (2592000 s) so the same image
    // is never re-processed within that period — biggest cost lever on Vercel.
    minimumCacheTTL: 2592000,
    // Only generate the device widths that the layout actually needs.
    // Removing the default 750 / 2048 / 3840 breakpoints cuts the number
    // of unique (src × width) variants that Vercel has to optimise.
    deviceSizes: [640, 828, 1080, 1200, 1920],
    // WebP gives great compression with lower encoding cost.
    // Skipping AVIF avoids the extra CPU-intensive encoding step.
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrasdegaia.pt',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.terrasdegaia.pt',
        pathname: '**',
      },
      // YouTube thumbnail images
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
