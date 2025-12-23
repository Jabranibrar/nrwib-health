const generateRedirects = require('./src/utils/redirects');
const path = require('path')

module.exports =  {
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000,
  trailingSlash: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  async rewrites() {
    return [
      {
        source: '/member-portal/action-teams/join-an-action-team',
        destination: '/join-an-action-team'
      },
      {
        source: '/about/meet-the-team/:path',
        destination: '/about/meet-the-team'
      },
      {
        source: '/resources/:path',
        destination: '/resources'
      },
      {
        source: '/for-educators/browse-knowledge/:path',
        destination: '/for-educators/browse-knowledge'
      }
    ];
  },
  async redirects() {
    const redirects = await generateRedirects();
    return [
      ...redirects,
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: 'eepurl.com'
      }
    ]
  },
  compress: true,
  eslint: {
    ignoreDuringBuilds: true
  }
};
