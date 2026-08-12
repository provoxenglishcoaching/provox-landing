'use client';

import { useActionState } from 'react';
import { saveCredentials, type CredentialsState } from '../actions/coach';

const initialState: CredentialsState = { error: '' };

export default function CredentialsForm({
  studentId,
  firstName,
  code,
}: {
  studentId: string;
  firstName: string;
  code: string;
}) {
  const action = saveCredentials.bind(null, studentId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--next-montserrat), sans-serif',
    fontWeight: 700,
    letterSpacing: '0.04em',
    background: '#fff',
    width: '100%',
    padding: '9px 11px',
    border: '1px solid var(--portal-slate-200)',
    borderRadius: '8px',
    fontSize: '13.5px',
    color: 'var(--foreground)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11.5px',
    fontWeight: 700,
    color: 'var(--portal-navy-700)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '5px',
  };

  return (
    <div
      style={{
        background: 'var(--portal-turq-100)',
        border: '1px solid #bfe9e7',
        borderRadius: '12px',
        padding: '14px 16px',
        margin: '16px 0 4px',
      }}
    >
      <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--portal-navy-700)', marginBottom: '10px' }}>
        Login details — share these with {firstName}
      </div>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '8px 10px', borderRadius: '8px', marginBottom: '10px' }}>
          {state.error}
        </div>
      )}
      <form action={formAction} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
        <div>
          <label style={labelStyle}>Student code</label>
          <input name="code" type="text" defaultValue={code} maxLength={8} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Reset password</label>
          <input name="password" type="text" placeholder="Leave blank to keep current" maxLength={40} style={inputStyle} />
        </div>
        <button
          type="submit"
          disabled={pending}
          style={{
            background: 'transparent',
            color: 'var(--portal-navy)',
            border: '1px solid var(--portal-slate-200)',
            borderRadius: '8px',
            padding: '9px 14px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: pending ? 'default' : 'pointer',
          }}
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </form>
      <div style={{ fontSize: '11.5px', color: '#4f5f7c', marginTop: '9px', lineHeight: 1.5 }}>
        Students sign in with this code and password at the portal sign-in screen — no email or account needed. The password is never stored in a readable form, so it can&apos;t be shown here — type a new one to reset it, or leave it blank to keep the current one.
      </div>
    </div>
  );
}
