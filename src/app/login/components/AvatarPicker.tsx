'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { AVATARS, avatarSrc, isValidAvatar } from '../lib/avatars';

export default function AvatarPicker({
  current,
  name,
  onSelect,
  label = 'Profile icon',
  hint,
}: {
  current: string;
  name: string;
  /** Bound server action that saves the chosen id. */
  onSelect: (avatar: string) => Promise<void>;
  label?: string;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // Shows the new icon straight away rather than waiting on the round trip.
  const [shown, setShown] = useState(current);

  function choose(id: string) {
    setShown(id);
    setOpen(false);
    startTransition(() => onSelect(id));
  }

  const chosen = shown && isValidAvatar(shown);

  return (
    <div style={{ background: '#fff', border: '1px solid var(--portal-slate-200)', borderRadius: '12px', padding: '14px 16px', margin: '16px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {chosen ? (
          <Image src={avatarSrc(shown)} alt="" width={52} height={52} style={{ borderRadius: '50%', background: '#e6e8f2' }} />
        ) : (
          <span
            aria-hidden="true"
            style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e6e8f2', display: 'inline-block' }}
          />
        )}

        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--portal-navy-700)' }}>
            {label}
          </div>
          <div style={{ fontSize: '11.5px', color: '#4f5f7c', marginTop: '3px', lineHeight: 1.5 }}>
            {hint ?? `Pick an icon for ${name}. They can change it themselves later.`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            disabled={pending}
            style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', borderRadius: '8px', padding: '9px 14px', fontSize: '12.5px', fontWeight: 700, cursor: pending ? 'default' : 'pointer' }}
          >
            {pending ? 'Saving…' : open ? 'Close' : chosen ? 'Change' : 'Choose'}
          </button>
          {chosen && (
            <button
              type="button"
              onClick={() => choose('')}
              disabled={pending}
              style={{ background: 'none', border: 'none', color: '#b0475c', fontSize: '12.5px', fontWeight: 700, cursor: pending ? 'default' : 'pointer' }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--portal-slate-200)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
            gap: '8px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {AVATARS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => choose(id)}
              aria-label={`Choose icon ${id}`}
              aria-pressed={id === shown}
              style={{
                padding: '3px',
                borderRadius: '50%',
                cursor: 'pointer',
                background: 'none',
                border: `2px solid ${id === shown ? 'var(--portal-turq)' : 'transparent'}`,
                lineHeight: 0,
              }}
            >
              <Image src={avatarSrc(id)} alt="" width={44} height={44} style={{ borderRadius: '50%', background: '#e6e8f2' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
