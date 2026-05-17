/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  /*
   * Static export — the site is fully SSG/ISR-friendly and Pagefind
   * needs flat HTML files to crawl. `out/` becomes the publishable
   * directory; the build script runs Pagefind against it.
   */
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
