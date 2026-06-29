'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds of delay after entering the viewport */
  delay?: number;
  variant?: 'fade-up' | 'fade-in';
  threshold?: number;
}

export default function AnimateIn({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
  threshold = 0.1,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        animationName: visible ? (variant === 'fade-up' ? 'fade-up' : 'fade-in') : undefined,
        animationDuration: visible ? (variant === 'fade-up' ? '0.6s' : '0.5s') : undefined,
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'both',
        animationDelay: visible && delay > 0 ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}
