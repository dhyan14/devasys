/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs', 'jose']
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    PROJECT_ROOT: __dirname
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 