/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds
  eslint: {
    // Skip ESLint during builds - this is helpful for deployment when you want to
    // focus on functionality over code style perfection
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    // Skip type checking during builds - this allows the app to deploy even with TypeScript errors
    ignoreBuildErrors: true,
  },
  
  // Optimize for performance and reduce TBT
  experimental: {
    // Enable React Server Components which can significantly reduce JavaScript sent to the client
    serverComponents: true,
    
    // Use concurrent features for smoother rendering
    concurrentFeatures: true,
    
    // Enable optimizations for React 18
    reactRoot: true,
    
    // Enable granular chunking for better code splitting
    granularChunks: true,
    
    // Optimize JavaScript parsing time with modern output
    outputStandalone: true,
    
    // Enable module/nomodule output
    esmExternals: true,
  },
  
  // Critical performance optimizations
  swcMinify: true, // Use SWC for minification (faster than Terser)
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  
  // Optimize image loading (significant factor in TBT reduction)
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200], // Optimized size set
    imageSizes: [16, 32, 48, 64, 96], // Optimized size set for icons/smaller images
    minimumCacheTTL: 60, // Cache images to prevent recalculation
  },
  
  // Configure compiler optimizations
  compiler: {
    // Remove React properties that are only used in development
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
