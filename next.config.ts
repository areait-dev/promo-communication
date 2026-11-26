import type { NextConfig } from "next";
import { isPreview } from "./src/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  // Permette di aprire il dev server da altri PC della rete locale (es. 192.168.x.x:3000)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 85 per le foto del team, 80 per le immagini dei progetti, 75 (default) per le miniature
    qualities: [75, 80, 85],
    // Le immagini ottimizzate restano in cache 31 giorni (WordPress non manda header di cache). I file sostituiti su
    // WordPress vanno caricati con un nome nuovo, altrimenti resta visibile la versione vecchia fino alla scadenza.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wp.promocommunication.it",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async headers() {
    return [
      // Immagini in public/img: nome senza hash, quindi 31 giorni e non "immutable" (/_next/static lo e' gia')
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2678400, stale-while-revalidate=86400" }] },
      // Stage (Preview di Vercel): header noindex su ogni risposta, oltre a robots.txt
      ...(isPreview ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []),
    ];
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
