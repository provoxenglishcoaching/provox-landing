'use client';

import { useState, useTransition } from 'react';
import { reviewSubmission } from '../actions/coach';

export default function FeedbackForm({
  submissionId,
  initialFeedback,
}: {
  submissionId: string;
  initialFeedback: string;
}) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData: FormData) => startTransition(() => reviewSubmission(submissionId, formData))}
      style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--portal-slate-200)' }}
    >
      <textarea
        name="feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Leave feedback for this submission…"
        style={{
          width: '100%',
          padding: '9px 11px',
          border: '1px solid var(--portal-slate-200)',
          borderRadius: '8px',
          fontSize: '13px',
          resize: 'vertical',
          minHeight: '60px',
          marginBottom: '8px',
        }}
      />
      <button
        type="submit"
        disabled={pending}
        style={{
          background: 'var(--portal-turq)',
          color: 'var(--portal-navy)',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '12.5px',
          fontWeight: 700,
          cursor: pending ? 'default' : 'pointer',
        }}
      >
        {pending ? 'Saving…' : 'Save feedback & mark reviewed'}
      </button>
    </form>
  );
}
