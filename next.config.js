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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      }
    ]
  },
  
  // Environment variables
  env: {
    GOOGLE_PLACES_API_KEY: 'AIzaSyDQM0JzTTB_Nh5BlJmL9866-6Jt9InByRw',
    GOOGLE_PLACE_ID: 'ChIJXwWa3Gg3N4gR18IWw-UDM_M'
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Optimized webpack configuration
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
