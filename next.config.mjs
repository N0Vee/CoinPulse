/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['chart.js', 'react-chartjs-2'],
  },

  // Image optimization
  images: {
    domains: ['assets.coincap.io'],
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // Advanced optimization
  webpack: (config, { dev, isServer }) => {
    // Bundle splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
