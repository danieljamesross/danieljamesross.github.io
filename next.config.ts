import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Built as plain HTML/JS/CSS into `out/` and served by GitHub Pages, so
  // nothing here may rely on a running server (Server Actions, Route Handlers
  // reading the request, image optimisation, etc.).
  output: "export",
  // Emit `/cv/index.html` rather than `/cv.html`, which static hosts like
  // GitHub Pages resolve for `/cv/` without any rewrite rules.
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    // The image optimiser needs a server; the project images are already
    // sized for the web on WordPress, so serve them as-is.
    unoptimized: true,
  },
};

export default nextConfig;
