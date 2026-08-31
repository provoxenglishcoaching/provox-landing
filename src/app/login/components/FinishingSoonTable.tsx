import Link from 'next/link';
import type { ContractWithCounts } from '../lib/db';
import { formatDateShort } from '../lib/schedule';
import { Badge, EmptyNote } from './DashUI';

export default function FinishingSoonTable({ contracts }: { contracts: ContractWithCounts[] }) {
  if (contracts.length === 0) {
    return <EmptyNote>No active contracts yet.</EmptyNote>;
  }

  // Fewest classes left first -- that's who needs renewing and paying next.
  const rows = [...contracts].sort((a, b) => a.remaining_sessions - b.remaining_sessions).slice(0, 6);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Classes left</th>
            <th>Last class</th>
            <th style={{ textAlign: 'right' }}>Payment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 600 }}>
                <Link
                  href={`/login/coach?tab=students&student=${c.student_id}`}
                  style={{ color: 'var(--dash-ink)', textDecoration: 'none' }}
                >
                  {c.student_name}
                </Link>
                <span style={{ color: 'var(--dash-muted)', fontWeight: 500 }}> · {c.name}</span>
              </td>
              <td>
                <Badge tone={c.remaining_sessions <= 2 ? 'bad' : c.remaining_sessions <= 5 ? 'neutral' : 'good'}>
                  {c.remaining_sessions} left
                </Badge>
              </td>
              <td className="dash-num" style={{ color: 'var(--dash-muted)' }}>
                {c.last_session_date ? formatDateShort(c.last_session_date) : '—'}
              </td>
              <td style={{ textAlign: 'right' }}>
                <Badge tone={c.payment_received ? 'good' : 'bad'}>{c.payment_received ? 'Paid' : 'Unpaid'}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
