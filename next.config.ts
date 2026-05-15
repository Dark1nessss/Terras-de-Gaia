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
