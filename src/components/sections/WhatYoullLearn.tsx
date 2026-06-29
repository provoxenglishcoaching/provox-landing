import { useTranslations } from 'next-intl';
import AnimateIn from '@/components/ui/AnimateIn';

const icons = [
  <svg key="1" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>,
  <svg key="2" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="3" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="4" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
];

export default function WhatYoullLearn() {
  const t = useTranslations('curriculum');
  const skills = t.raw('skills') as { title: string; description: string }[];

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateIn className="mb-14">
          <p className="font-montserrat text-teal uppercase tracking-[0.25em] text-xs font-semibold mb-3">
            The Curriculum
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-montserrat font-bold text-navy text-3xl md:text-4xl mb-2">
                {t('heading')}
              </h2>
              <p className="text-teal font-montserrat font-semibold text-base">
                {t('subheading')}
              </p>
            </div>
            <p className="text-navy/50 text-sm font-body max-w-xs md:text-right">{t('note')}</p>
          </div>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 gap-5">
          {skills.map((skill, i) => (
            <AnimateIn key={skill.title} delay={i * 80}>
              <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal/30 hover:-translate-y-0.5 transition-all duration-200 h-full flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy group-hover:bg-teal/10 group-hover:text-teal transition-colors">
                  {icons[i]}
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-navy text-sm mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-navy/60 text-sm leading-relaxed font-body">
                    {skill.description}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
