import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce development warnings
  productionBrowserSourceMaps: false,
  
  // Fix turbopack workspace root warning
  turbopack: {
    root: '.'
  },
  
  // Optimize for deployment
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  }
};

export default nextConfig;
