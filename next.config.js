/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // External packages that should be handled by Node.js runtime
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'jose', 'mongoose']
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    PROJECT_ROOT: __dirname
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force specific modules to use Node.js runtime
  webpack: (config, { isServer, nextRuntime }) => {
    // Only apply this in edge runtime
    if (isServer && nextRuntime === 'edge') {
      // This marks all modules that use mongoose as noops
      config.resolve.alias = {
        ...config.resolve.alias,
        'mongoose': false,
        'mongodb-connection-string-url': false,
        'mongodb': false,
        'bson': false,
        'aws4': false,
        'bcryptjs': false,
        '@aws-sdk/credential-providers': false,
        '@mongodb-js/zstd': false,
        'kerberos': false,
        'mongodb-client-encryption': false,
        'snappy': false,
        '@mongodb-js/zstd': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 