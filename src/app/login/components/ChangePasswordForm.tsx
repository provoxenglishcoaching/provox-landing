'use client';

import { useActionState, useRef, useEffect } from 'react';
import { changeMasterPassword, type ChangePasswordState } from '../actions/coach';

const initialState: ChangePasswordState = { error: '', success: false };

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeMasterPassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--portal-slate-200)',
    borderRadius: '8px',
    fontSize: '14px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#4f5f7c',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '5px',
  };

  return (
    <form ref={formRef} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px' }}>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px' }}>
          {state.error}
        </div>
      )}
      {state.success && (
        <div style={{ background: 'var(--portal-turq-100)', color: 'var(--portal-navy-700)', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px' }}>
          Master password updated.
        </div>
      )}
      <div>
        <label style={labelStyle}>Current password</label>
        <input name="current" type="password" required autoComplete="off" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>New password</label>
        <input name="next" type="password" required minLength={8} autoComplete="off" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Confirm new password</label>
        <input name="confirm" type="password" required minLength={8} autoComplete="off" style={inputStyle} />
      </div>
      <button
        type="submit"
        disabled={pending}
        style={{
          background: 'var(--portal-navy)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '11px 18px',
          fontWeight: 700,
          fontSize: '13.5px',
          cursor: pending ? 'default' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
