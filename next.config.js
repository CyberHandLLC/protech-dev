/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds
  eslint: {
    // Skip ESLint during builds - this is helpful for deployment when you want to
    // focus on functionality over code style perfection
    ignoreDuringBuilds: true,
  },
  
  // Other Next.js config options as needed
  reactStrictMode: true,
  
  // Handle images from external sources if needed
  images: {
    domains: ['localhost']
  }
};

module.exports = nextConfig;
