'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          program: data.get('program'),
          message: data.get('message'),
        }),
      });
      if (res.ok) { setStatus('sent'); form.reset(); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  const inputStyle = {
    background: 'var(--input-background)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    color: 'var(--foreground)',
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--foreground)',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label style={labelStyle}>Full name</label>
          <input name="name" type="text" required placeholder="Nguyen Van An" style={inputStyle} />
        </div>
        <div className="flex flex-col">
          <label style={labelStyle}>Email</label>
          <input name="email" type="email" required placeholder="you@email.com" style={inputStyle} />
        </div>
      </div>

      <div className="flex flex-col">
        <label style={labelStyle}>I'm interested in</label>
        <select name="program" style={inputStyle}>
          <option value="">Select a program…</option>
          <option>Professional Communication</option>
          <option>Communication Skills</option>
          <option>Custom Curriculum</option>
          <option>Not sure yet</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label style={labelStyle}>Tell me about your goal</label>
        <textarea name="message" required rows={4} placeholder="Briefly describe what you're working towards…"
          style={{ ...inputStyle, resize: 'none' }} />
      </div>

      <button type="submit" disabled={status === 'sending' || status === 'sent'}
        className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 group disabled:opacity-60"
        style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px' }}>
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message sent ✓' : (
          <>Send message
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
      {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try emailing directly.</p>}
    </form>
  );
}
