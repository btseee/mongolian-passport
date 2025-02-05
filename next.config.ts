import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    distDir: "docs",
    output: "export",
    images:{
        domains: ['flagcdn.com']
    }
};

export default nextConfig;
