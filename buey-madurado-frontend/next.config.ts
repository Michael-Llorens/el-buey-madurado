import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  // ✅ Configuración de proxy para reemplazar middleware deprecated
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/admin/:path*',
          destination: '/admin/:path*',
        },
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
  // ✅ Headers de seguridad
  headers: async () => {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'x-protected-route',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;