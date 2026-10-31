import type { NextConfig } from "next";

// Built as a fully static site for GitHub Pages. TMDB is only called at build time,
// so the token stays in the GitHub Actions secret and never reaches the browser.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Set by the deploy workflow to "/<repo-name>" for project pages; empty locally.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Pages fetch a lot from TMDB during the build.
  staticPageGenerationTimeout: 300,
  // One build worker, so the request cap in lib/tmdb.ts holds for the whole build
  // and TMDB's rate limit isn't hit.
  experimental: { cpus: 1 },
};

export default nextConfig;
