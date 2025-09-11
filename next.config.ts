import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
    ],
    // Optimize image loading
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable experimental features for better performance
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
    scrollRestoration: true,
  },

  // Bundle analyzer (conditionally enabled)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any) => {
      if (process.env.NODE_ENV === "production") {
        // Add bundle analyzer
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "./analyze/client.html",
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),

  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Output optimization
  output: "standalone",

  // Enable SWC minification
  // swcMinify: true, // Removed as it's not a valid option in Next.js 15
};

export default nextConfig;
