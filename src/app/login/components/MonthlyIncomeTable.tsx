import type { MonthlyIncomeRow } from '../lib/db';
import { formatVnd, formatHours, formatMonth } from '../lib/income';
import { EmptyNote } from './DashUI';

export default function MonthlyIncomeTable({ rows }: { rows: MonthlyIncomeRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyNote>
        Nothing banked yet. A month appears once its classes are ticked complete and the
        contract is marked paid.
      </EmptyNote>
    );
  }

  const peak = Math.max(...rows.map((r) => r.income), 1);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Classes</th>
            <th>Hours</th>
            <th style={{ textAlign: 'right' }}>Paid income</th>
            <th style={{ width: '28%' }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month}>
              <td style={{ fontWeight: 600 }}>{formatMonth(r.month)}</td>
              <td className="dash-num">{r.classes_completed}</td>
              <td className="dash-num">{formatHours(r.hours)}</td>
              <td className="dash-num" style={{ textAlign: 'right', fontWeight: 700 }}>
                {formatVnd(r.income)}
              </td>
              <td>
                {/* Bar is relative to the best month, so the shape of the year
                    reads at a glance without needing an axis. */}
                <div style={{ background: '#eceef7', borderRadius: '999px', height: '7px', width: '100%' }}>
                  <div
                    style={{
                      width: `${Math.max(3, (r.income / peak) * 100)}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, var(--portal-turq) 0%, #7aa8f0 100%)',
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
