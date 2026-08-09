import type { SubmissionRow } from '../lib/db';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function SubmissionCard({
  submission,
  feedbackSlot,
}: {
  submission: SubmissionRow;
  /** Coach view: an editable feedback form. Student view: read-only feedback display (or nothing yet). */
  feedbackSlot?: React.ReactNode;
}) {
  const reviewed = submission.status === 'reviewed';

  return (
    <div style={{ border: '1px solid var(--portal-slate-200)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
        <span style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--portal-navy)' }}>{submission.title}</span>
        <span
          style={{
            display: 'inline-flex',
            fontSize: '10.5px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '4px 9px',
            borderRadius: '20px',
            background: reviewed ? 'var(--portal-ok)' : 'var(--portal-slate-200)',
            color: reviewed ? '#fff' : 'var(--portal-navy)',
          }}
        >
          {reviewed ? 'Reviewed' : 'Submitted'}
        </span>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--portal-slate)', marginBottom: '8px' }}>
        {formatDateTime(submission.date_submitted)}
      </div>
      {submission.body_text && (
        <div style={{ fontSize: '13px', color: '#4f5f7c', lineHeight: 1.5, margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>
          {submission.body_text}
        </div>
      )}
      {submission.file_url && (
        <a
          href={`/portal/files?id=${submission.id}`}
          style={{ color: 'var(--portal-turq-600)', fontWeight: 700, textDecoration: 'none', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          {submission.file_name ?? 'Download file'}
        </a>
      )}
      {feedbackSlot}
    </div>
  );
}
