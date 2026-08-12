'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Course = {
  id: string;
  name: string;
  format: string;
  badge?: string;
  description: string;
  featuresLabel?: string;
  features: string[];
  bestFor: string;
  priceFrom: number;
};

const FLEXIBLE: Course = {
  id: 'flexible',
  name: 'Flexible English Course',
  format: 'Online or in-person',
  description: 'Our most popular course, with live, coach-led classes and a clear learning plan.',
  featuresLabel: 'Flexible learning:',
  features: [
    'Choose your time, coach and topic',
    'Join online group or private classes 24/7',
    'Follow a structured course for steady progress',
  ],
  bestFor: 'Best for learners who want flexibility in the topics they learn',
  priceFrom: 20,
};

const CONFIDENT: Course = {
  id: 'confident',
  name: 'Confident Communication',
  format: 'Online or in-person',
  description: 'This course focuses on helping you improve general skills like speaking and listening to help you communicate naturally and confidently.',
  features: [
    'Choose your time and coach',
    'Every session structured to meet your needs',
    'Learn essential skills like expressing yourself, connecting with others, and showing confidence',
  ],
  bestFor: 'Best for learners who want to improve everyday speaking and listening',
  priceFrom: 20,
};

const EXAM_PREP: Course = {
  id: 'exam-prep',
  name: 'IELTS / TOEFL preparation',
  format: 'Online or in-person',
  description: 'Get ready for your test with coaches who will help you learn the necessary skills to improve your test score.',
  featuresLabel: 'Flexible learning:',
  features: [
    'Choose your time, focus and coach',
    'Join online group or private classes 24/7',
    'Practise with mock tests and online exercises',
    'Learn key skills and test strategies',
  ],
  bestFor: 'Best for learners who want structured learning to prepare for official English language tests',
  priceFrom: 25,
};

const PROFESSIONAL: Course = {
  id: 'professional',
  name: 'Professional Communication',
  format: 'Online or in-person',
  badge: 'Most popular',
  description: 'This is a business English course based on the VOX: Professional Communication curriculum. This course will teach you the necessary skills to use English professionally at your job and can be completed in just 12 weeks. Your coach will tailor the sessions to your workplace and industry.',
  features: [
    'Choose your time and coach',
    '24 structured 1-on-1 coaching sessions',
    'The full VOX — Professional Communication curriculum',
    'Personalized feedback tailored to your job',
  ],
  bestFor: 'Best for learners who want to focus on using English at work.',
  priceFrom: 25,
};

// The "Most popular" badge is per-tab: Flexible for teens, Professional
// Communication for adults.
const TABS = [
  {
    id: 'teens' as const,
    label: 'Teens',
    courses: [{ ...FLEXIBLE, badge: 'Most popular' }, CONFIDENT, EXAM_PREP],
  },
  {
    // Confident Communication sits last so it's the one you scroll to reach.
    id: 'adults' as const,
    label: 'Adults',
    courses: [FLEXIBLE, PROFESSIONAL, EXAM_PREP, CONFIDENT],
  },
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.2rem' }}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const CourseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: 'var(--primary)', flexShrink: 0 }}>
    <path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M5 10.5V16c0 1.7 3.1 3 7 3s7-1.3 7-3v-5.5"/>
  </svg>
);

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'left' ? <path d="m15 18-6-6 6-6"/> : <path d="m9 18 6-6-6-6"/>}
  </svg>
);

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="relative w-full">
      {/* Textured turquoise block offset behind the card */}
      <div aria-hidden="true"
        className="absolute inset-0 hidden sm:block"
        style={{
          backgroundColor: '#58c8b8',
          backgroundImage: "url('/texture-turquoise.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'translate(12px, 12px)',
        }} />

      {course.badge && (
        <span className="absolute -top-3 left-4 z-20 text-xs font-semibold px-3 py-1.5"
          style={{ background: '#ffe14d', color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
          {course.badge}
        </span>
      )}

      <div className="relative z-10 h-full flex flex-col p-7 md:p-8" style={{ background: 'var(--card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
          {course.format}
        </p>

        <div className="flex items-start gap-2.5 mb-4">
          <CourseIcon />
          <h3 className="text-xl leading-snug font-bold"
            style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            {course.name}
          </h3>
        </div>

        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--foreground)' }}>
          {course.description}
        </p>

        {course.featuresLabel && (
          <p className="text-sm mb-3" style={{ color: 'var(--foreground)' }}>{course.featuresLabel}</p>
        )}

        <ul className="flex flex-col gap-2.5 mb-6">
          {course.features.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-snug" style={{ color: 'var(--foreground)' }}>
              <CheckIcon />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
          {course.bestFor}
        </p>

        <p className="text-sm font-semibold border-t pt-4 mb-6 mt-auto"
          style={{ color: 'var(--primary)', borderColor: 'var(--border)', fontFamily: 'Montserrat, sans-serif' }}>
          Prices start at just ${course.priceFrom} per class
        </p>

        <a href="#contact"
          className="self-start px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif' }}>
          Learn more
        </a>
      </div>
    </div>
  );
}

/**
 * Horizontal carousel. Up to three cards fit at a time, so a three-course tab
 * shows everything at once and a four-course tab hides the last card until you
 * page across — the British Council pattern.
 */
function CourseCarousel({ courses }: { courses: Course[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.getBoundingClientRect().width + 32; // card + gap
    const perPage = Math.max(1, Math.round(track.clientWidth / step));
    const pages = Math.max(1, courses.length - perPage + 1);
    setPageCount(pages);
    setPage(Math.min(Math.round(track.scrollLeft / step), pages - 1));
  }, [courses.length]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Reset to the first card whenever the tab changes.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
    setPage(0);
  }, [courses]);

  const goTo = (next: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const step = card.getBoundingClientRect().width + 32;
    const clamped = Math.max(0, Math.min(next, pageCount - 1));
    track.scrollTo({ left: clamped * step, behavior: 'smooth' });
    setPage(clamped);
  };

  const scrollable = pageCount > 1;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={measure}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 -mb-4 pr-4 pt-4 -mt-4"
        style={{ scrollbarWidth: 'none' }}>
        {courses.map((course) => (
          <div key={course.id}
            className="snap-start shrink-0 flex w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {scrollable && (
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous courses"
            className="w-11 h-11 flex items-center justify-center transition-opacity disabled:opacity-35"
            style={{ background: 'var(--card)', color: 'var(--primary)' }}>
            <Chevron dir="left" />
          </button>

          <span className="text-sm font-semibold tabular-nums"
            style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            {page + 1} / {pageCount}
          </span>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="More courses"
            className="w-11 h-11 flex items-center justify-center transition-opacity disabled:opacity-35"
            style={{ background: 'var(--card)', color: 'var(--primary)' }}>
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Courses() {
  const [activeTab, setActiveTab] = useState<'teens' | 'adults'>('adults');
  const courses = TABS.find((t) => t.id === activeTab)!.courses;

  return (
    <section id="courses">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
          English Courses
        </h2>
        <p className="text-base mb-10" style={{ color: 'var(--foreground)' }}>
          Choose the perfect English learning solution for your needs
        </p>

        <div className="flex justify-center" role="tablist" aria-label="Choose a course group">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className="px-12 sm:px-16 py-3.5 text-base font-semibold transition-colors"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: 'var(--primary)',
                  background: active ? 'var(--band)' : 'transparent',
                  borderBottom: active ? '3px solid var(--accent)' : '1px solid var(--border)',
                }}>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'var(--band)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-center text-base mb-12" style={{ color: 'var(--primary)' }}>
            All courses can be done 1:1 or as group classes
          </p>

          <CourseCarousel key={activeTab} courses={courses} />
        </div>
      </div>
    </section>
  );
}
