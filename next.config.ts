import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  async redirects() {
    // The student portal moved from /portal to /login. Keep old bookmarks working.
    return [
      { source: '/portal', destination: '/login', permanent: true },
      { source: '/portal/:path*', destination: '/login/:path*', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
