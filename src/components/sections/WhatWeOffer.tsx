import { useTranslations } from 'next-intl';
import AnimateIn from '@/components/ui/AnimateIn';

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function WhatWeOffer() {
  const t = useTranslations('whatWeOffer');
  const courses = t.raw('courses') as {
    name: string;
    price: string;
    period: string;
    commitmentNote: string;
    badge?: string;
    description: string;
    features: string[];
    cta: string;
  }[];

  return (
    <section id="pricing" className="bg-gray-50 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <AnimateIn className="text-center mb-14">
          <h2 className="font-montserrat font-bold text-navy text-3xl md:text-4xl mb-3">
            {t('heading')}
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-body max-w-xl mx-auto">
            {t('subheading')}
          </p>
        </AnimateIn>

        {/* Course cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {courses.map((course, i) => (
            <AnimateIn key={course.name} delay={i * 120}>
              <div className="relative bg-white rounded-2xl border-2 border-navy/10 shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">

                {/* Price badge */}
                <div className="bg-teal px-5 py-2.5 inline-flex items-center gap-2 self-start rounded-br-2xl">
                  <span className="font-montserrat font-black text-white text-lg leading-none">
                    {course.price}
                  </span>
                  <span className="text-white/80 text-sm font-body">{course.period}</span>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 gap-5">
                  {/* Course name + optional badge */}
                  <div>
                    <h3 className="font-montserrat font-black text-navy text-xl md:text-2xl mb-2">
                      {course.name}
                    </h3>
                    {course.badge && (
                      <span className="inline-block bg-navy/8 text-navy text-xs font-montserrat font-semibold px-3 py-1 rounded-full tracking-wide">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed font-body">
                    {course.description}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Features */}
                  <ul className="flex flex-col gap-3 flex-1">
                    {course.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-navy text-sm font-body">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Commitment note */}
                  <p className="text-teal font-body font-semibold text-sm text-center bg-teal/8 rounded-xl py-2.5 px-4">
                    {course.commitmentNote}
                  </p>

                  {/* CTA */}
                  <a
                    href="#contact"
                    className="w-full flex items-center justify-center px-6 py-3.5 bg-navy text-white font-montserrat font-bold text-sm rounded-xl hover:bg-navy-light hover:scale-[1.02] transition-all shadow-md shadow-navy/15 focus:outline-none focus:ring-2 focus:ring-navy/40"
                  >
                    {course.cta}
                  </a>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Custom / Ongoing coaching note */}
        <AnimateIn delay={250}>
          <div className="bg-navy rounded-2xl px-8 py-8 text-center">
            <h3 className="font-montserrat font-bold text-white text-lg mb-2">
              {t('customHeading')}
            </h3>
            <p className="text-white/70 font-body text-sm leading-relaxed max-w-xl mx-auto mb-5">
              {t('customBody')}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 bg-teal text-white font-montserrat font-bold text-sm rounded-xl hover:bg-teal/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {t('customCta')}
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
