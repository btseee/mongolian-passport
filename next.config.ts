import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    basePath: "/mongolian-passport",
    output: "export",
    images:{
        domains: ['flagcdn.com']
    }
};

export default nextConfig;
