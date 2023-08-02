/** @type {import('next').NextConfig} */
const nextConfig = {
  //Can't resolve 'fs' Error
  //fix:https://github.com/family/connectkit/discussions/235#discussioncomment-6081996
  //fix:https://github.com/wagmi-dev/wagmi/issues/2300#issuecomment-1541425648
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }
    return config
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
