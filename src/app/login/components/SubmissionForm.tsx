'use client';

import { useActionState, useRef, useEffect } from 'react';
import { submitWork, type SubmitWorkState } from '../actions/student';
import { MAX_FILE_SIZE_LABEL } from '../lib/upload';

const initialState: SubmitWorkState = { error: '', success: false };

export default function SubmissionForm() {
  const [state, formAction, pending] = useActionState(submitWork, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const fieldLabel: React.CSSProperties = {
    display: 'block',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#4f5f7c',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '5px',
  };

  const fieldInput: React.CSSProperties = {
    width: '100%',
    padding: '9px 11px',
    border: '1px solid var(--portal-slate-200)',
    borderRadius: '8px',
    fontSize: '13.5px',
    background: '#fff',
  };

  return (
    <div style={{ background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px' }}>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          {state.error}
        </div>
      )}
      {state.success && (
        <div style={{ background: 'var(--portal-turq-100)', color: 'var(--portal-navy-700)', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          Submitted.
        </div>
      )}
      <form ref={formRef} action={formAction}>
        <div style={{ marginBottom: '10px' }}>
          <label style={fieldLabel}>Title</label>
          <input name="title" type="text" placeholder="e.g. Session 11 writing practice" required maxLength={90} style={fieldInput} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={fieldLabel}>Write or paste your work (optional)</label>
          <textarea name="text" placeholder="Type or paste your answer here…" style={{ ...fieldInput, resize: 'vertical', minHeight: '90px' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={fieldLabel}>Attach a file (optional)</label>
          <input name="file" type="file" accept=".docx,.doc,.pdf,.png,.jpg,.jpeg" style={{ fontSize: '13px' }} />
          <div style={{ fontSize: '11.5px', color: 'var(--portal-slate)', marginTop: '4px' }}>
            Word, PDF, or image — up to {MAX_FILE_SIZE_LABEL}.
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: pending ? 'default' : 'pointer' }}
        >
          {pending ? 'Submitting…' : 'Submit work'}
        </button>
      </form>
    </div>
  );
}
