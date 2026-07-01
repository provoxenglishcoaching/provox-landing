'use client';

export default function StatBar() {
  const stats = [
    { value: '10 yrs', label: 'Professional experience' },
    { value: '1-on-1', label: 'For individuals' },
    { value: 'Cohorts', label: 'Groups of 2–4' },
    { value: 'CLT', label: 'Teaching method' },
  ];

  return (
    <section className="border-y" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
        {stats.map((s) => (
          <div key={s.label} className="text-center md:px-6">
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
            <p className="text-xs uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
