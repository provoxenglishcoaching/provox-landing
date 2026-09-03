'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { login, type LoginState } from '../actions/auth';

const initialState: LoginState = { error: '' };

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  const inputStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid var(--portal-slate-200)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    textAlign: 'center',
    letterSpacing: '0.06em',
    fontFamily: 'var(--next-montserrat), sans-serif',
    fontWeight: 600,
    color: 'var(--foreground)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#4f5f7c',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '5px',
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--portal-slate-200)',
        borderRadius: '18px',
        boxShadow: 'var(--portal-shadow-lg)',
        padding: '32px 30px',
        maxWidth: '360px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
        <Image
          src="/logo-vertical.png"
          alt="ProVox — English Coaching"
          width={1178}
          height={951}
          priority
          style={{ width: '160px', height: 'auto' }}
        />
      </div>
      <h2
        style={{
          margin: '0 0 6px',
          fontSize: '19px',
          color: 'var(--portal-navy)',
          textAlign: 'center',
          fontFamily: 'var(--next-montserrat), sans-serif',
          fontWeight: 700,
        }}
      >
        Student Sign-in
      </h2>
      <p style={{ margin: '0 0 22px', fontSize: '13px', color: '#6b7a93', textAlign: 'center', lineHeight: 1.5 }}>
        Enter your student code and password
      </p>

      {state?.error && (
        <div
          style={{
            background: '#fbeeef',
            color: '#b0475c',
            fontSize: '12.5px',
            fontWeight: 600,
            padding: '9px 12px',
            borderRadius: '8px',
            marginBottom: '14px',
            textAlign: 'center',
          }}
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-3.5">
        <div>
          <label style={labelStyle}>Code</label>
          <input name="code" type="text" placeholder="e.g. K7QT" maxLength={8} autoComplete="off" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input name="password" type="password" placeholder="Password" maxLength={40} autoComplete="off" required style={inputStyle} />
        </div>
        <button
          type="submit"
          disabled={pending}
          style={{
            width: '100%',
            justifyContent: 'center',
            marginTop: '4px',
            background: 'var(--portal-navy)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '11px 18px',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: pending ? 'default' : 'pointer',
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
