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
  
  // Handle images from external sources including Google profile photos and Facebook trackers
  images: {
    domains: [
      'localhost',
      'maps.googleapis.com',
      'maps.gstatic.com',
      'lh3.googleusercontent.com',
      'streetviewpixels-pa.googleapis.com',
      'www.facebook.com',
      'connect.facebook.net',
      'graph.facebook.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.facebook.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.facebook.net',
        pathname: '**',
      }
    ]
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Set up redirects from old services2 URLs to new services URLs
  async redirects() {
    return [
      {
        source: '/services2',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/services2/:path*',
        destination: '/services/:path*',
        permanent: true,
      },
    ];
  },
  
  // Optimized webpack configuration
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
