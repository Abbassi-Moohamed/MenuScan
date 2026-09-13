import type { NextConfig } from "next";

/**
 * Backend API origin. Server-only (never exposed to the browser). Used by the
 * `/api/v1/*` rewrite and by server-side data fetching. Set this on the hosting
 * platform (e.g. the Render service URL on Vercel) in production.
 */
const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Menu photos/logos come from arbitrary backend URLs (any image host).
    // Serving them unoptimized sidesteps remote-domain allow-listing while
    // keeping the Next/Image layout API and its fallbacks.
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Proxy the MENU SCAN REST API through the Next origin. Keeps the
        // browser same-origin (no CORS) in every environment: local dev,
        // `next start`, and Vercel edge.
        source: "/api/v1/:path*",
        destination: `${backendApiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;