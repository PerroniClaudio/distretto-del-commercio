import type { NextConfig } from "next";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

// Ottieni __dirname per ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Aggiungi il plugin solo per il build del client
    if (!isServer) {
      // Percorso del file sorgente
      const sourcePath = path.resolve(
        __dirname,
        "node_modules/.pnpm/bootstrap-italia@2.16.0/node_modules/bootstrap-italia/dist/css/bootstrap-italia.min.css"
      );

      // Percorso di destinazione
      const destPath = path.resolve(__dirname, "app/bootstrap-italia.css");

      // Verifica che il file sorgente esista prima di copiare
      if (fs.existsSync(sourcePath)) {
        config.plugins.push(
          new CopyPlugin({
            patterns: [
              {
                from: sourcePath,
                to: destPath,
                noErrorOnMissing: true, // Non fallire se il file non esiste
              },
            ],
            options: {
              concurrency: 100,
            },
          })
        );
      } else {
        console.warn(`⚠️  Bootstrap Italia CSS non trovato in: ${sourcePath}`);
      }
    }
    return config;
  },
};

export default nextConfig;
