import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,   // tells Next.js the root is apps/web
  },
};

export default nextConfig;
