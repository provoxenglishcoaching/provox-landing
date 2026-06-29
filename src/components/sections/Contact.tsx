import { useTranslations } from 'next-intl';
import ZaloCTA from '@/components/ui/ZaloCTA';
import KakaoCTA from '@/components/ui/KakaoCTA';
import ContactForm from '@/components/ui/ContactForm';
import AnimateIn from '@/components/ui/AnimateIn';

export default function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className="bg-navy py-24 px-4 relative overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #2abfbf 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimateIn className="mb-12">
          <p className="font-montserrat text-teal uppercase tracking-[0.25em] text-xs font-semibold mb-3">
            Get in Touch
          </p>
          <h2 className="font-montserrat font-bold text-white text-3xl md:text-4xl mb-3">
            {t('heading')}
          </h2>
          <p className="text-white/60 text-lg font-body">{t('subheading')}</p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick contact */}
          <AnimateIn delay={100} className="flex flex-col gap-3">
            <ZaloCTA label={t('zaloLabel')} />
            <KakaoCTA label={t('kakaoLabel')} id="BradHerdt" />

            {/* Email */}
            <a
              href="mailto:brad@provoxcoach.com"
              className="flex items-center justify-center gap-3 bg-white/8 text-white border border-white/15 px-6 py-4 rounded-xl font-semibold hover:bg-white/12 transition-colors focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-body text-sm">brad@provoxcoach.com</span>
            </a>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/provoxenglish"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ProVox on Facebook"
                className="flex-1 flex items-center justify-center gap-2 bg-white/8 text-white border border-white/15 px-4 py-3 rounded-xl font-semibold hover:bg-white/12 transition-colors focus:outline-none focus:ring-2 focus:ring-teal text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-body">Facebook</span>
              </a>
              <a
                href="https://www.linkedin.com/in/bradherdt/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Coach Brad on LinkedIn"
                className="flex-1 flex items-center justify-center gap-2 bg-white/8 text-white border border-white/15 px-4 py-3 rounded-xl font-semibold hover:bg-white/12 transition-colors focus:outline-none focus:ring-2 focus:ring-teal text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="font-body">LinkedIn</span>
              </a>
            </div>

            <p className="text-center text-white/40 text-xs font-body pt-1">
              {t('responseNote')}
            </p>
          </AnimateIn>

          {/* Email form */}
          <AnimateIn delay={200} className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            <h3 className="font-montserrat font-bold text-navy text-base mb-5">
              {t('emailHeading')}
            </h3>
            <ContactForm />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
