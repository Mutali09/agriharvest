import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Completely disable development indicators
  devIndicators: false,
  // Ensure clean output
  poweredByHeader: false,
};

export default nextConfig;
