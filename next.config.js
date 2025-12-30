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
  
  // Add caching headers for static pages (Fix #5 from original plan)
  async headers() {
    return [
      {
        // Cache service pages for 1 hour with stale-while-revalidate
        source: '/services/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache image files aggressively
        source: '/:path*.(jpg|jpeg|png|gif|svg|webp|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache CSS and JS files aggressively
        source: '/:path*.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
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
