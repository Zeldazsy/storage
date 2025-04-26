/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    typedRoutes: true,
    optimizeCss: true,
    optimizeFonts: true,
    serverActions: true,
    serverRendering: 'blocking', // <- เพิ่มบรรทัดนี้
  },
  compress: true,
}

export default nextConfig
