import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "*"
      }
    ]
  }
};

export default nextConfig;
