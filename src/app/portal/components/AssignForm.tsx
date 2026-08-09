'use client';

import { useActionState, useRef, useEffect } from 'react';
import { addAssignment, type AddAssignmentState } from '../actions/coach';

const initialState: AddAssignmentState = { error: '' };

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

export default function AssignForm({ studentId, firstName }: { studentId: string; firstName: string }) {
  const action = addAssignment.bind(null, studentId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(pending);

  useEffect(() => {
    // Reset only after a successful submit completes (pending: true -> false with no error).
    if (prevPending.current && !pending && !state.error) formRef.current?.reset();
    prevPending.current = pending;
  }, [pending, state.error]);

  return (
    <form
      ref={formRef}
      action={formAction}
      style={{ background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px', margin: '18px 0 22px' }}
    >
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          {state.error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div>
          <label style={fieldLabel}>Title</label>
          <input name="title" type="text" placeholder="e.g. Practice: Handling Disagreement" required maxLength={90} style={fieldInput} />
        </div>
        <div>
          <label style={fieldLabel}>Type</label>
          <select name="type" style={fieldInput} defaultValue="Homework">
            <option value="Homework">Homework</option>
            <option value="Material">Material</option>
            <option value="Resource">Resource Link</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={fieldLabel}>Instructions / notes</label>
        <textarea name="description" placeholder="What should they do with this?" style={{ ...fieldInput, resize: 'vertical', minHeight: '56px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div>
          <label style={fieldLabel}>Link (optional)</label>
          <input name="url" type="url" placeholder="https://…" style={fieldInput} />
        </div>
        <div>
          <label style={fieldLabel}>Due date (optional)</label>
          <input name="dueDate" type="date" style={fieldInput} />
        </div>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={fieldLabel}>Attach a file instead of a link (optional)</label>
        <input name="file" type="file" accept=".docx,.doc,.pdf,.png,.jpg,.jpeg" style={{ fontSize: '13px' }} />
        <div style={{ fontSize: '11.5px', color: 'var(--portal-slate)', marginTop: '4px' }}>
          Word, PDF, or image — up to 25MB.
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: pending ? 'default' : 'pointer' }}
      >
        {pending ? 'Sending…' : `Send to ${firstName}`}
      </button>
    </form>
  );
}
