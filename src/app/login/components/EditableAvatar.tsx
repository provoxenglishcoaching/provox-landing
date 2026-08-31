'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useTransition } from 'react';
import { AVATARS, avatarSrc, isValidAvatar } from '../lib/avatars';

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function Placeholder({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ display: 'block', borderRadius: '50%', background: '#e6e8f2' }}>
      <circle cx="20" cy="15.5" r="6.2" fill="#b9c0d4" />
      <path d="M8.5 33c1.6-6 6-9 11.5-9s9.9 3 11.5 9z" fill="#b9c0d4" />
    </svg>
  );
}

/** Avatar with a pencil badge that opens the icon grid. */
export default function EditableAvatar({
  avatar,
  name,
  size = 54,
  onSelect,
}: {
  avatar: string;
  name: string;
  size?: number;
  /** Bound server action that saves the chosen id. */
  onSelect: (avatar: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // Show the new icon immediately rather than waiting on the round trip.
  const [shown, setShown] = useState(avatar);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click-away and Escape, so the panel behaves like any other popover.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function choose(id: string) {
    setShown(id);
    setOpen(false);
    startTransition(() => onSelect(id));
  }

  const chosen = shown && isValidAvatar(shown);

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 'none' }}>
      <div style={{ position: 'relative', width: size, height: size, opacity: pending ? 0.6 : 1 }}>
        {chosen ? (
          <Image src={avatarSrc(shown)} alt="" width={size} height={size} style={{ borderRadius: '50%', background: '#e6e8f2', display: 'block' }} />
        ) : (
          <Placeholder size={size} />
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={pending}
          aria-label={`Change ${name}'s profile icon`}
          aria-expanded={open}
          title="Change profile icon"
          style={{
            position: 'absolute',
            right: -3,
            bottom: -3,
            width: '23px',
            height: '23px',
            borderRadius: '50%',
            border: '2px solid #fff',
            background: 'var(--portal-turq)',
            color: 'var(--portal-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: pending ? 'default' : 'pointer',
            padding: 0,
            boxShadow: '0 1px 4px rgba(9,18,40,0.3)',
          }}
        >
          <PencilIcon />
        </button>
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: `calc(100% + 10px)`,
            left: 0,
            zIndex: 30,
            width: 'min(320px, 78vw)',
            background: '#fff',
            border: '1px solid var(--portal-slate-200)',
            borderRadius: '14px',
            boxShadow: '0 18px 44px rgba(9,18,40,0.28)',
            padding: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--portal-navy-700)' }}>
              Choose an icon
            </span>
            {chosen && (
              <button
                type="button"
                onClick={() => choose('')}
                style={{ background: 'none', border: 'none', color: '#b0475c', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Remove
              </button>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))',
              gap: '7px',
              maxHeight: '250px',
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
                  padding: '2px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: 'none',
                  border: `2px solid ${id === shown ? 'var(--portal-turq)' : 'transparent'}`,
                  lineHeight: 0,
                }}
              >
                <Image src={avatarSrc(id)} alt="" width={40} height={40} style={{ borderRadius: '50%', background: '#e6e8f2' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
