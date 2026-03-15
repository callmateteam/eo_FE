import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "eo-character-assets.s3.ap-northeast-2.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
