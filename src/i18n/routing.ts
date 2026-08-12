import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  // English-only site — serve it from / rather than /en.
  localePrefix: 'as-needed',
});
