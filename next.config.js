/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Core Next.js settings
  reactStrictMode: true,
  
  // Performance optimizations compatible with Next.js 15.3.1
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Handle images from external sources if needed
  images: {
    domains: ['localhost']
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Optimized webpack configuration
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
