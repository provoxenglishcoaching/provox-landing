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
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--next-nunito',
  display: 'swap',
});

const titles: Record<string, string> = {
  en: 'ProVox — Professional English Coaching',
  ko: 'ProVox — 비즈니스 영어 코칭',
  vi: 'ProVox — Luyện Tiếng Anh Chuyên Nghiệp',
};

const descriptions: Record<string, string> = {
  en: 'Natural. Confident. A premium 1-on-1 English coaching program for adults in Ho Chi Minh City.',
  ko: '자연스럽게. 자신 있게. 성인을 위한 프리미엄 1대1 영어 코칭 프로그램.',
  vi: 'Tự nhiên. Tự tin. Chương trình coaching tiếng Anh 1-on-1 cao cấp dành cho người lớn.',
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL('https://provoxcoach.com'),
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    themeColor: '#fffffe',
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
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
  if (!routing.locales.includes(locale as 'en' | 'ko' | 'vi')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} ${nunitoSans.variable} antialiased`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <footer className="bg-navy border-t border-white/10 py-8 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs font-body">
              <p>© {new Date().getFullYear()} ProVox Professional English Coaching</p>
              <p>provoxcoach.com · brad@provoxcoach.com</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
