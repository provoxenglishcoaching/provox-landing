'use client';

import { useActionState, useRef, useEffect } from 'react';
import { addStudent, type AddStudentState } from '../actions/coach';

const initialState: AddStudentState = { error: '', created: null };

export default function AddStudentForm() {
  const [state, formAction, pending] = useActionState(addStudent, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.created) formRef.current?.reset();
  }, [state.created]);

  return (
    <div style={{ marginTop: '12px' }}>
      <form ref={formRef} action={formAction} style={{ display: 'flex', gap: '8px' }}>
        <input
          name="name"
          type="text"
          placeholder="Add student name"
          required
          maxLength={60}
          style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--portal-slate-200)', borderRadius: '8px', fontSize: '13px' }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            background: 'var(--portal-turq)',
            color: 'var(--portal-navy)',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 14px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: pending ? 'default' : 'pointer',
          }}
        >
          {pending ? 'Adding…' : 'Add'}
        </button>
      </form>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '8px 10px', borderRadius: '8px', marginTop: '8px' }}>
          {state.error}
        </div>
      )}
      {state.created && (
        <div
          style={{
            background: 'var(--portal-turq-100)',
            border: '1px solid #bfe9e7',
            borderRadius: '10px',
            padding: '12px 14px',
            marginTop: '10px',
            fontSize: '12.5px',
            color: 'var(--portal-navy-700)',
            lineHeight: 1.6,
          }}
        >
          <strong>{state.created.name}</strong> added. Login code and password (shown once — write these down now):
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontFamily: 'var(--next-montserrat), sans-serif', fontWeight: 800 }}>
            <span>Code: {state.created.code}</span>
            <span>Password: {state.created.password}</span>
          </div>
        </div>
      )}
    </div>
  );
}
