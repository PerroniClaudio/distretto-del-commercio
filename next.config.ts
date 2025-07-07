import type { NextConfig } from "next";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Ottieni __dirname per ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Aggiungi il plugin solo per il build del client
    if (!isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(
                __dirname,
                "node_modules/.pnpm/bootstrap-italia@2.16.0/node_modules/bootstrap-italia/dist/"
              ),
              to: path.resolve(__dirname, "public/bootstrap-italia/dist"),
            },
          ],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
