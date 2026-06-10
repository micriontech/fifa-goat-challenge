/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: "/api/news",
        headers: [{ key: "Cache-Control", value: "s-maxage=600, stale-while-revalidate=60" }],
      },
    ];
  },
};

export default nextConfig;
