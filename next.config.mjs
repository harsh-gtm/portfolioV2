/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ["three"],
};

export default nextConfig;
