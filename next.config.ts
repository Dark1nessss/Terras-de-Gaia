import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
