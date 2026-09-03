import Image from 'next/image';
import HeroCarousel from '@/components/ui/HeroCarousel';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

export default function Hero() {
  return (
    <section className="relative pb-16 md:pb-0">
      <div className="grid md:grid-cols-2">

        {/*
          Left — logo, paragraph, CTA. Capping the inner block at half the
          max-w-6xl container (1152/2) and pushing it to the column's right
          edge lands its text on exactly the same line as every other section's
          `max-w-6xl mx-auto px-6` container — at any viewport, and without
          100vw math that would misjudge the scrollbar.
        */}
        <div className="pt-32 pb-12 md:pb-28">
          {/*
            The logo centres across the whole column — that is, between the
            page's left edge and where the carousel starts — rather than
            lining up with the copy beneath it. Left-aligned on mobile, where
            the column is the full viewport and centring would strand it.
          */}
          <div className="flex justify-start md:justify-center px-6 mb-10">
            {/* The wide lockup, landing page only — the portal screens keep
                the stacked one. Runs wider than the stacked logo did to hold
                the same presence at a 3.18:1 aspect. */}
            <Image
              src="/logo-horizontal.png"
              alt="ProVox — Professional English Coaching"
              width={1588}
              height={499}
              priority
              className="w-64 md:w-[380px] lg:w-[420px] h-auto"
            />
          </div>

          {/* Copy stays aligned to the shared max-w-6xl container. */}
          <div className="md:flex md:justify-end">
            <div className="w-full md:max-w-[576px] px-6">
              <p className="text-lg leading-relaxed mb-9 max-w-md" style={{ color: 'var(--foreground)' }}>
                Learn English with native English tutors. Our courses are designed to meet your
                specific needs. From communication skills to business English, from IELTS to TOEFL,
                ProVox will teach you. Find out which course is best for you.
              </p>

              <a href="#courses"
                className="inline-flex items-center gap-2 px-7 py-4 text-sm font-semibold transition-opacity hover:opacity-90 group"
                style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif' }}>
                Get started
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>

        {/*
          Right — carousel. The section carries no top padding, so on md+ this
          column starts at the very top of the page (running up behind the fixed
          navbar) and stretches to the row's full height, out to the right edge
          of the viewport. Stacked below the copy on mobile, where it needs its
          own height since the carousel fills it absolutely.
        */}
        <div className="relative min-h-[360px] sm:min-h-[440px] md:min-h-0">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
