import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['example.com', 'res.cloudinary.com'], // Add the hostname of your external image here
  },
};

export default nextConfig;
