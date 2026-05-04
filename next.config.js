/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ESLint v9 incompatível com Next.js 14 — rodar separadamente via `npx eslint .`
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
