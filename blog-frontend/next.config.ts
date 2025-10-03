import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["example.com", "res.cloudinary.com", "ui-avatars.com"], 
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
