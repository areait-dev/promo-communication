import type { NextConfig } from "next";
import { isPreview } from "./src/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  // Permette di aprire il dev server da altri PC della rete locale (es. 192.168.x.x:3000)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 80 per foto del team e immagini dei progetti, 75 (default) per le miniature
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wp.promocommunication.it",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  // Stage (Preview di Vercel): header noindex su ogni risposta, oltre a robots.txt
  async headers() {
    return isPreview ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : [];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
