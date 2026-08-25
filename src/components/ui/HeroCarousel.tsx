'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

type Slide = { label: string; src: string; alt: string; objectPosition: string };

/**
 * All three photos are 3:2 landscape dropped into a much narrower frame, so
 * `cover` throws away roughly a third of their width. `objectPosition` aims
 * that crop per photo rather than blindly centring it.
 */
const SLIDES: Slide[] = [
  {
    label: 'Communication',
    src: '/hero-1.jpg',
    alt: 'Two women talking together over a laptop',
    // Favours the top of the frame, so the pair sit lower and keep whatever
    // headroom the (tightly shot) original has.
    objectPosition: '50% 15%',
  },
  {
    label: 'IELTS / TOEFL',
    src: '/hero-2.jpg',
    alt: 'Two students talking together outside a university',
    objectPosition: '50% 50%',
  },
  {
    label: 'Business English',
    src: '/hero-3.jpg',
    alt: 'A professional English coaching session',
    // Centred, this crop cut the man on the right out of frame entirely.
    objectPosition: '85% 50%',
  },
];

const ROTATE_MS = 3000;
const FADE_MS = 700;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

const controlButton =
  'flex items-center justify-center h-10 w-10 rounded-full text-white transition-colors ' +
  'border border-white/45 bg-black/20 hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/** Fills its nearest positioned ancestor, so the caller controls the shape. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  // Keyed on index, so the timer restarts whenever the slide changes: a manual
  // click gives the slide it lands on a full interval rather than whatever was
  // left of the previous one's.
  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setTimeout(() => go(index + 1), ROTATE_MS);
    return () => clearTimeout(id);
  }, [index, paused, reducedMotion, go]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="ProVox course areas"
    >
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <figure
            key={slide.src}
            className="absolute inset-0 m-0"
            style={{
              opacity: active ? 1 : 0,
              transition: reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease-out`,
            }}
            aria-hidden={!active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />

            {/* Scrims — one down the left edge under the caption, and a lighter
                one at the foot to hold the controls off the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(9,18,40,0.74) 0%, rgba(9,18,40,0.36) 38%, rgba(9,18,40,0) 68%), ' +
                  'linear-gradient(to top, rgba(9,18,40,0.45) 0%, rgba(9,18,40,0) 22%)',
              }}
            />

            <figcaption
              className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 max-w-[70%] text-white font-bold uppercase tracking-[0.04em] text-3xl sm:text-4xl lg:text-5xl leading-[1.1]"
              style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '0 2px 18px rgba(9,18,40,0.45)' }}
            >
              {slide.label}
            </figcaption>
          </figure>
        );
      })}

      <div className="absolute right-6 md:right-10 bottom-6 md:bottom-10 flex items-center gap-3">
        <button type="button" onClick={() => go(index - 1)} className={controlButton} aria-label="Previous course area">
          <Chevron dir="left" />
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${slide.label}`}
              aria-current={i === index}
              className="h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                width: i === index ? '26px' : '8px',
                background: i === index ? 'var(--accent)' : 'rgba(255,255,255,0.55)',
              }}
            />
          ))}
        </div>

        <button type="button" onClick={() => go(index + 1)} className={controlButton} aria-label="Next course area">
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
