import type { ContractSessionRow } from '../lib/db';
import { formatSessionDate, formatTime12h } from '../lib/schedule';
import { updateSession } from '../actions/coach';

const fieldInput: React.CSSProperties = {
  padding: '7px 9px',
  border: '1px solid var(--portal-slate-200)',
  borderRadius: '7px',
  fontSize: '12.5px',
  background: '#fff',
};

export default function SessionsList({
  sessions,
  editable = false,
}: {
  sessions: ContractSessionRow[];
  /** Coach view: renders inline date/time edit fields for one-off reschedules. */
  editable?: boolean;
}) {
  if (sessions.length === 0) {
    return (
      <div style={{ fontSize: '13px', color: 'var(--portal-slate)', padding: '10px 0' }}>
        No classes scheduled yet.
      </div>
    );
  }

  return (
    <div>
      {sessions.map((s) => (
        <div
          key={s.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '10px 12px',
            borderBottom: '1px solid var(--portal-slate-200)',
            fontSize: '13.5px',
            color: 'var(--foreground)',
          }}
        >
          {editable ? (
            <form action={updateSession.bind(null, s.id)} style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
              <input type="date" name="date" defaultValue={s.session_date} required style={fieldInput} />
              <input type="time" name="time" defaultValue={s.time_of_day} required style={fieldInput} />
              <button
                type="submit"
                style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Save
              </button>
            </form>
          ) : (
            <span style={{ fontWeight: 600 }}>
              {formatSessionDate(s.session_date)} — {formatTime12h(s.time_of_day)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
