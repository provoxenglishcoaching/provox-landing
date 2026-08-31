import Link from 'next/link';
import type { ReactNode } from 'react';

export type BadgeTone = 'good' | 'bad' | 'neutral';

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  const palette =
    tone === 'good'
      ? { background: 'var(--dash-good-bg)', color: 'var(--dash-good-ink)' }
      : tone === 'bad'
        ? { background: 'var(--dash-bad-bg)', color: 'var(--dash-bad-ink)' }
        : { background: '#eceef7', color: 'var(--dash-muted)' };

  return (
    <span
      style={{
        ...palette,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 9px',
        borderRadius: '999px',
        fontSize: '11.5px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  badge,
  hint,
}: {
  label: string;
  value: string;
  badge?: { text: string; tone: BadgeTone };
  hint?: string;
}) {
  return (
    <div className="dash-stat">
      <div style={{ fontSize: '12.5px', color: 'var(--dash-muted)', marginBottom: '7px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span
          className="dash-num"
          style={{
            fontFamily: 'var(--next-montserrat), sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            letterSpacing: '-0.01em',
            color: 'var(--dash-ink)',
            lineHeight: 1.15,
          }}
        >
          {value}
        </span>
        {badge && <Badge tone={badge.tone}>{badge.text}</Badge>}
      </div>
      {hint && <div style={{ fontSize: '11.5px', color: 'var(--dash-muted)', marginTop: '5px' }}>{hint}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  padded = true,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <section className="dash-card" style={{ padding: padded ? '20px 22px' : 0 }}>
      {(title || action) && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          {title && (
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--next-montserrat), sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--dash-ink)',
              }}
            >
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '28px 8px', textAlign: 'center', color: 'var(--dash-muted)', fontSize: '13.5px', lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

export function Tabs({ active }: { active: 'overview' | 'students' }) {
  const tabs: { key: 'overview' | 'students'; label: string; href: string }[] = [
    { key: 'overview', label: 'Overview', href: '/login/coach' },
    { key: 'students', label: 'Students', href: '/login/coach?tab=students' },
  ];

  return (
    <nav className="dash-tabs">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href} className="dash-tab" data-active={t.key === active}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
