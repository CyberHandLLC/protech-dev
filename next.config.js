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
  
  // Handle images from external sources including Google profile photos
  images: {
    domains: [
      'localhost',
      'maps.googleapis.com',
      'maps.gstatic.com',
      'lh3.googleusercontent.com',
      'streetviewpixels-pa.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      }
    ]
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Optimized webpack configuration
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
