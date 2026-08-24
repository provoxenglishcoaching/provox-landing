'use client';

import { useState, type ReactNode } from 'react';

export default function PortalTabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--portal-slate-200)', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${active === i ? 'var(--portal-turq)' : 'transparent'}`,
              padding: '10px 14px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: active === i ? 'var(--portal-navy)' : 'var(--portal-slate)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs[active]?.content}
    </div>
  );
}
