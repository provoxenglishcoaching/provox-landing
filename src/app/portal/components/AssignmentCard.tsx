import type { AssignmentRow } from '../lib/db';
import TypeBadge from './TypeBadge';

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AssignmentCard({
  assignment,
  onDelete,
  onToggle,
}: {
  assignment: AssignmentRow;
  /** Coach view: bound server action that deletes this assignment. */
  onDelete?: () => Promise<void>;
  /** Student view: bound server action that toggles this assignment's status. */
  onToggle?: () => Promise<void>;
}) {
  const done = assignment.status === 'completed';

  return (
    <div
      style={{
        border: '1px solid var(--portal-slate-200)',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '10px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        background: done ? '#fafbf9' : '#fff',
      }}
    >
      {onToggle ? (
        <form action={onToggle}>
          <button
            type="submit"
            aria-label={done ? 'Mark incomplete' : 'Mark complete'}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: `2px solid ${done ? 'var(--portal-ok)' : 'var(--portal-slate-200)'}`,
              flex: 'none',
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: done ? 'var(--portal-ok)' : '#fff',
              cursor: 'pointer',
            }}
          >
            {done && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        </form>
      ) : (
        <div
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            border: `2px solid ${done ? 'var(--portal-ok)' : 'var(--portal-slate-200)'}`,
            flex: 'none',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: done ? 'var(--portal-ok)' : '#fff',
          }}
        >
          {done && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: '14.5px',
              color: 'var(--portal-navy)',
              textDecoration: done ? 'line-through' : 'none',
              opacity: done ? 0.6 : 1,
            }}
          >
            {assignment.title}
          </span>
          <TypeBadge type={assignment.type} />
        </div>
        {assignment.description && (
          <div style={{ fontSize: '13px', color: '#4f5f7c', lineHeight: 1.5, margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>
            {assignment.description}
          </div>
        )}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', fontSize: '12px', color: 'var(--portal-slate)' }}>
          {assignment.due_date && <span>Due {formatDate(assignment.due_date)}</span>}
          {assignment.url && (
            <a
              href={assignment.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--portal-turq-600)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10 14L14 10" />
                <path d="M8 17H6a5 5 0 0 1 0-10h2" />
                <path d="M16 7h2a5 5 0 0 1 0 10h-2" />
              </svg>
              Open link
            </a>
          )}
          {assignment.file_url && (
            <a
              href={`/portal/files?type=assignment&id=${assignment.id}`}
              style={{ color: 'var(--portal-turq-600)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {assignment.file_name ?? 'Download file'}
            </a>
          )}
        </div>
      </div>

      {onDelete && (
        <div style={{ flex: 'none' }}>
          <form action={onDelete}>
            <button
              type="submit"
              style={{ background: 'none', border: 'none', color: '#b0475c', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
