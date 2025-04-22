/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds
  eslint: {
    // Skip ESLint during builds - this is helpful for deployment when you want to
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize image loading for mobile - critical for TBT reduction
  images: {
    domains: ['localhost', 'example.com', 'images.unsplash.com'],
    // Add specific sizes for mobile devices
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
    // Use more aggressive image optimization for mobile
    minimumCacheTTL: 60, // 1 minute cache
    // Use modern image formats that are more efficient
    formats: ['image/avif', 'image/webp'],
    // Use quality setting to prioritize faster loads on mobile
    quality: 70,
  },
  
  // Optimize for performance and reduce TBT
  experimental: {
    // Use SWC for faster compilation - major impact on mobile TBT
    swcMinify: true,
    // Create smaller, more efficient chunks
    granularChunks: true,
    // Optimize server components delivery
    serverComponents: true,
    // Enable tree shaking for the app directory
    appDir: true,
    // Mobile-specific optimizations - critical for reducing bundle size
    optimizePackageImports: ['react-dom', 'react', 'next/link', 'next/image'],
    // Reduce JavaScript bundle size for mobile devices
    modularizeImports: {
      'lodash-es': {
        transform: 'lodash-es/{{member}}',
      },
    },
    // Prefetch critical assets - helps on mobile connections
    optimisticClientCache: true,
  },
  
  // Script optimization - removes console logs to save CPU on mobile
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Critical performance optimizations
  compress: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps for mobile to reduce bundle size
  
  // Enable React Fast Refresh - improves build times and iterations
  webpack: (config, { dev, isServer }) => {
    // Mobile-specific optimizations: optimize builds and reduce chunks
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
        },
        runtimeChunk: {
          name: 'runtime',
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
