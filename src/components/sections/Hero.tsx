import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="bg-white pt-20 pb-24 px-4 relative overflow-hidden">
      {/* Subtle teal accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-teal" aria-hidden="true" />

      {/* Decorative dot pattern — top right, very subtle */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-[0.07] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #2abfbf 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.05] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #132861 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div className="order-2 md:order-1">
            {/* Eyebrow */}
            <p className="font-montserrat text-teal uppercase tracking-[0.25em] text-xs font-semibold mb-5 animate-fade-in stagger-1">
              Professional English Coaching
            </p>

            {/* Headline */}
            <h1 className="font-montserrat font-light text-navy leading-tight mb-6 animate-fade-up stagger-2"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
              <span className="block">{t('line1')}</span>
              <span className="block">{t('line2')}</span>
              <span className="block font-black text-teal">{t('line3')}</span>
            </h1>

            {/* Subheading */}
            <p className="text-navy/60 text-lg leading-relaxed font-body mb-8 max-w-md animate-fade-up stagger-3">
              {t('subheading')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-4 bg-navy text-white font-montserrat font-bold text-sm rounded-xl hover:bg-navy-light transition-all hover:scale-[1.02] shadow-lg shadow-navy/15 focus:outline-none focus:ring-2 focus:ring-navy/40"
              >
                {t('cta')}
              </a>
              <a
                href="#program"
                className="inline-flex items-center justify-center px-7 py-4 border-2 border-navy/20 text-navy font-montserrat font-semibold text-sm rounded-xl hover:border-navy/40 transition-colors focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                See the courses
              </a>
            </div>
          </div>

          {/* Right — logo mark large display */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fade-in stagger-2">
            <div className="relative">
              {/* Large logo on a soft navy card */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-navy rounded-3xl flex items-center justify-center shadow-2xl shadow-navy/20 relative overflow-hidden">
                {/* Subtle dot texture inside card */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #2abfbf 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                  aria-hidden="true"
                />
                <Image
                  src="/logo-dark.svg"
                  alt="ProVox"
                  width={220}
                  height={140}
                  className="relative z-10 w-52 md:w-64 h-auto"
                  priority
                />
              </div>
              {/* Floating accent badge */}
              <div className="absolute -bottom-4 -right-4 bg-teal text-white text-xs font-montserrat font-bold px-4 py-2 rounded-xl shadow-lg">
                Premium 1-on-1
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
