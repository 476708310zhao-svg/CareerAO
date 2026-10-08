import type { NextConfig } from "next";
import path from "node:path";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath,
  outputFileTracingRoot: path.resolve(process.cwd()),
  async rewrites() {
    const backend = (process.env.BACKEND_API_URL || "http://127.0.0.1:4400").replace(/\/$/, "");
    return [{ source: "/backend/:path*", destination: `${backend}/:path*` }];
  },
};

export default nextConfig;
