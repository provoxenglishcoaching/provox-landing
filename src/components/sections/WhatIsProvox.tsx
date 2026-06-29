import Image from 'next/image';
import { useTranslations } from 'next-intl';
import AnimateIn from '@/components/ui/AnimateIn';

export default function WhatIsProvox() {
  const t = useTranslations('whatIsProvox');

  return (
    <section id="program" className="bg-offwhite py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Coach photo */}
          <AnimateIn className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-navy/15">
                <Image
                  src="/brad-photo.png"
                  alt={t('coachName')}
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Name card */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100">
                <p className="font-montserrat font-black text-navy text-sm">{t('coachName')}</p>
                <p className="text-teal text-xs font-semibold mt-0.5">{t('coachTitle')}</p>
              </div>
              {/* Teal accent square behind photo */}
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-teal/15 rounded-2xl -z-10" aria-hidden="true" />
            </div>
          </AnimateIn>

          {/* Text */}
          <AnimateIn delay={150}>
            <p className="font-montserrat text-teal uppercase tracking-[0.25em] text-xs font-semibold mb-4">
              About ProVox
            </p>
            <h2 className="font-montserrat font-bold text-navy text-3xl md:text-4xl mb-6 leading-tight">
              {t('heading')}
            </h2>
            <p className="text-navy/70 text-lg leading-relaxed mb-8 font-body">
              {t('body')}
            </p>

            {/* Contact strip */}
            <div className="border-t border-navy/10 pt-6">
              <p className="text-navy/50 text-sm mb-4 font-body">{t('consultation')}</p>
              <div className="flex flex-col gap-3 text-sm font-body">
                <a
                  href="https://zalo.me/0965869015"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-navy hover:text-teal transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-navy/8 flex items-center justify-center text-xs font-black group-hover:bg-teal/10 transition-colors">Z</span>
                  <span>0965869015</span>
                </a>
                <div className="flex items-center gap-3 text-navy">
                  <span className="w-8 h-8 rounded-lg bg-navy/8 flex items-center justify-center text-xs font-black">K</span>
                  <span>BradHerdt</span>
                </div>
                <a
                  href="mailto:brad@provoxcoach.com"
                  className="flex items-center gap-3 text-navy hover:text-teal transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-navy/8 flex items-center justify-center group-hover:bg-teal/10 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <span>brad@provoxcoach.com</span>
                </a>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
