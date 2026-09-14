import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Menu photos/logos come from arbitrary backend URLs (any image host).
    // Serving them unoptimized sidesteps remote-domain allow-listing while
    // keeping the Next/Image layout API and its fallbacks.
    unoptimized: true,
  },
};

export default nextConfig;