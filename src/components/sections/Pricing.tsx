import { useTranslations } from 'next-intl';
import Image from 'next/image';
import AnimateIn from '@/components/ui/AnimateIn';

export default function Pricing() {
  const t = useTranslations('pricing');
  const features = t.raw('features') as string[];

  return (
    <section id="pricing" className="bg-white py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimateIn>
          <h2 className="font-montserrat font-bold text-navy text-3xl md:text-4xl text-center mb-12">
            {t('heading')}
          </h2>
        </AnimateIn>

        <AnimateIn delay={100} className="relative rounded-3xl border-2 border-navy/10 overflow-hidden shadow-xl">
          {/* Price badge */}
          <div className="bg-teal px-6 py-3 inline-flex items-center gap-2 rounded-br-2xl">
            <Image src="/logo.svg" alt="" width={20} height={20} aria-hidden="true" />
            <span className="font-montserrat font-black text-white text-xl">
              {t('price')}
            </span>
          </div>

          <div className="p-8 md:p-10">
            {/* Tier name */}
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.svg" alt="" width={28} height={28} aria-hidden="true" />
              <h3 className="font-montserrat font-black text-navy text-xl md:text-2xl">
                {t('tier')}
              </h3>
            </div>

            {/* Divider */}
            <div className="border-t border-navy/10 mb-6" />

            {/* Features */}
            <p className="text-gray-500 text-sm font-body mb-4">{t('includes')}</p>
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-navy font-body">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA — matches Hero button style */}
            <a
              href="#contact"
              className="w-full flex items-center justify-center px-6 py-4 bg-navy text-white font-montserrat font-bold text-base rounded-xl hover:bg-navy-light hover:scale-[1.02] transition-all shadow-lg shadow-navy/20 focus:outline-none focus:ring-2 focus:ring-navy/40"
            >
              {t('cta')}
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
