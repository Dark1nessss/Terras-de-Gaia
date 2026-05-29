import type { NextConfig } from "next";
import { lstatSync, realpathSync } from "fs";
import path from "path";

// On cPanel, nodevenv creates node_modules as a symlink pointing outside the
// project root, which causes Turbopack to panic. Detect this and expand the
// Turbopack root to the common ancestor of the project and the real path.
function getTurbopackRoot(): string | undefined {
  try {
    const nmPath = path.join(process.cwd(), "node_modules");
    if (lstatSync(nmPath).isSymbolicLink()) {
      const realPath = realpathSync(nmPath);
      const parts1 = process.cwd().split(path.sep);
      const parts2 = realPath.split(path.sep);
      const common: string[] = [];
      for (let i = 0; i < Math.min(parts1.length, parts2.length); i++) {
        if (parts1[i] === parts2[i]) common.push(parts1[i]);
        else break;
      }
      return common.length > 1 ? common.join(path.sep) || path.sep : undefined;
    }
  } catch { /* node_modules not present or not a symlink */ }
  return undefined;
}

const turbopackRoot = getTurbopackRoot();

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  ...(turbopackRoot ? { turbopack: { root: turbopackRoot } } : {}),
  // Skip TypeScript check during build - we run tsc separately in the build script.
  // This avoids spawning extra worker threads that exhaust cPanel's thread limit.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrasdegaia.pt',
        pathname: '**',
      },
      // If you are using standard WordPress paths, you can also add:
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
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
