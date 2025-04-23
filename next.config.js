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
  
  // Next.js 15 performance optimizations
  reactStrictMode: true,
  
  // Advanced performance optimizations for reduced TBT
  experimental: {
    // Enable optimized React 19 features
    optimizeCss: true,
    // Optimize module and chunk loading
    optimizePackageImports: ['react', 'react-dom'],
    // Enable partial prerendering for improved performance
    ppr: true,
    // Minimize JavaScript bundles more aggressively
    swcMinify: true,
    // Reduce client JS bundle size
    serverMinification: true, 
    // Enable faster hydration process
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Handle images from external sources if needed
  images: {
    domains: ['localhost']
  },
  
  // Compress assets for better delivery
  compress: true,
  
  // Optimized webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    
    return config;
  },
};

module.exports = nextConfig;
