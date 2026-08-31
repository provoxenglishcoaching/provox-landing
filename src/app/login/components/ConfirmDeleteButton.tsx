'use client';

import { useState, useTransition } from 'react';

const linkButton: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: '12.5px',
  fontWeight: 700,
  cursor: 'pointer',
};

/**
 * Two-step delete. The work and its stored file go for good, so a stray
 * click shouldn't be enough to lose a student's submission.
 */
export default function ConfirmDeleteButton({
  onConfirm,
  label = 'Delete',
  confirmLabel = 'Delete permanently?',
}: {
  onConfirm: () => Promise<void>;
  label?: string;
  confirmLabel?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();

  if (pending) {
    return <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--portal-slate)' }}>Deleting…</span>;
  }

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} style={{ ...linkButton, color: '#b0475c' }}>
        {label}
      </button>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '12px', color: '#b0475c', fontWeight: 700 }}>{confirmLabel}</span>
      <button
        type="button"
        onClick={() => startTransition(() => onConfirm())}
        style={{ ...linkButton, color: '#fff', background: '#b0475c', borderRadius: '7px', padding: '5px 11px', fontSize: '12px' }}
      >
        Yes, delete
      </button>
      <button type="button" onClick={() => setArmed(false)} style={{ ...linkButton, color: 'var(--portal-slate)', fontSize: '12px' }}>
        Cancel
      </button>
    </span>
  );
}
