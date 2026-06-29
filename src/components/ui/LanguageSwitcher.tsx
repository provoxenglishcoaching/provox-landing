'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

const localeLabels: Record<string, string> = {
  en: 'EN',
  ko: '한국어',
  vi: 'VI',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1">
      {['en', 'ko', 'vi'].map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => switchLocale(l)}
            className={`text-sm font-medium px-1 transition-colors ${
              l === locale
                ? 'text-teal font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {localeLabels[l]}
          </button>
          {i < 2 && <span className="text-white/30 text-xs">|</span>}
        </span>
      ))}
    </div>
  );
}
