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
  },
  
  // Optimize for performance and reduce TBT
  experimental: {
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
    // Mobile-specific optimizations: optimize builds for mobile performance
    if (!isServer) {
      // Optimize chunk splitting for better mobile performance
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a specific bundle for framework code
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Group larger common dependencies together
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          // Common components used across multiple pages
          commons: {
            name: 'commons',
            minChunks: 3,
            priority: 20,
          },
          // Remaining shared code
          shared: {
            name: false,
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
      
      // Add runtime chunk for better caching
      config.optimization.runtimeChunk = 'single';
    }
    return config;
  },
};

module.exports = nextConfig;
