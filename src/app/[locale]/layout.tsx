import type { Metadata } from 'next';
import { Montserrat, Nunito_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  variable: '--next-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--next-nunito',
  display: 'swap',
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'ProVox — Professional English Coaching',
    ko: 'ProVox — 비즈니스 영어 코칭',
    vi: 'ProVox — Luyện Tiếng Anh Chuyên Nghiệp',
  };
  const description = 'A premium coaching program for adults who want to speak English with confidence.';
  const ogImage = 'https://www.provoxcoach.com/og-image.png';

  return {
    metadataBase: new URL('https://www.provoxcoach.com'),
    title: titles[locale] ?? titles.en,
    description,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description,
      url: 'https://www.provoxcoach.com',
      siteName: 'ProVox English Coaching',
      images: [{ url: ogImage, width: 1536, height: 768, alt: 'ProVox — Professional English Coaching' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] ?? titles.en,
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ko' | 'vi')) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} ${nunitoSans.variable}`}>
      <head> <meta property="og:image" content="https://www.provoxcoach.com/og-image.png" />
        <meta property="og:image" content="https://www.provoxcoach.com/og-image.png" />
        <meta property="og:image:width" content="1536" />
        <meta property="og:image:height" content="768" />
        <meta name="twitter:image" content="https://www.provoxcoach.com/og-image.png" />
      </head>
      <body style={{ WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-bold" style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
                ProVox English Coaching
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                © 2026 · Brad Herdt · Indochina Time (GMT+7)
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
