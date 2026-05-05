/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['image.pollinations.ai'],
  },
  serverExternalPackages: ['convex'],
  trailingSlash: false,
}
export default nextConfig
