'use client';

import { useTransition } from 'react';
import { updateSessionStatus } from '../actions/coach';
import type { SessionStatus } from '../lib/db';

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--foreground)',
  cursor: 'pointer',
};

export default function SessionStatusToggle({ sessionId, status }: { sessionId: string; status: SessionStatus }) {
  const [pending, startTransition] = useTransition();

  function setStatus(next: SessionStatus) {
    startTransition(() => updateSessionStatus(sessionId, next));
  }

  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', opacity: pending ? 0.6 : 1 }}>
      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={status === 'completed'}
          disabled={pending}
          onChange={(e) => setStatus(e.target.checked ? 'completed' : 'scheduled')}
        />
        Completed
      </label>
      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={status === 'rescheduled'}
          disabled={pending}
          onChange={(e) => setStatus(e.target.checked ? 'rescheduled' : 'scheduled')}
        />
        Rescheduled
      </label>
    </div>
  );
}
