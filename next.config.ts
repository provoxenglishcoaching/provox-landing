import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Uploads travel through server actions, which default to a 1MB body --
      // well under the 25MB the forms used to advertise. 4.5MB is the ceiling
      // Vercel allows a server-side upload, so files are capped at 4MB (see
      // lib/upload.ts) leaving room for the rest of the form.
      bodySizeLimit: '4.5mb',
    },
  },
  async redirects() {
    // The student portal moved from /portal to /login. Keep old bookmarks working.
    return [
      { source: '/portal', destination: '/login', permanent: true },
      { source: '/portal/:path*', destination: '/login/:path*', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
