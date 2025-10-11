import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },

  images: {
    unoptimized: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  poweredByHeader: false,

  compress: true,

  async redirects() {
    return [
      {
        source: "/mushoku-tensei",
        destination: "https://anilist.co/review/28685",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.com/users/1230319937155760131",
        permanent: true,
      },
      {
        source: "/gh",
        destination: "https://github.com/keircn",
        permanent: true,
      },
      {
        source: "/al",
        destination: "https://anilist.co/user/keiran",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|webp|avif|ico|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
