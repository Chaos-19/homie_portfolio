import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pcmag.com",
        pathname: "/imagery/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dy1wwd9av/**",
      },
    ],
  },
};

export default nextConfig;
