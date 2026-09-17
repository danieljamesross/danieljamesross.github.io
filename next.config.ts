import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vitruviandan.wordpress.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
