import type { NextConfig } from "next";

// GitHub Pages project site → served under /StudyVaults.
// basePath only in production so local dev stays at the root.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/StudyVaults" : "";

const nextConfig: NextConfig = {
  output: "export", // fully static HTML → GitHub Pages
  basePath,
  images: { unoptimized: true }, // no Image Optimization server on Pages
  trailingSlash: true, // /a/b/ → /a/b/index.html (nested routes work on Pages)
};

export default nextConfig;
