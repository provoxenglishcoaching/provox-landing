import type { ContractWithCounts } from '../lib/db';
import { contractFinancials, formatVnd, formatDuration } from '../lib/income';
import { EmptyNote } from './DashUI';

export default function HourlyRateTable({ contracts }: { contracts: ContractWithCounts[] }) {
  if (contracts.length === 0) {
    return <EmptyNote>No active contracts yet.</EmptyNote>;
  }

  const rows = contracts
    .map((c) => ({
      contract: c,
      money: contractFinancials({
        feeAmount: c.monthly_fee_amount,
        weeklyClasses: c.weekly_classes,
        classDurationMinutes: c.class_duration_minutes,
        rescheduledCount: c.rescheduled_sessions,
      }),
    }))
    .sort((a, b) => b.money.hourlyRate - a.money.hourlyRate);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class length</th>
            <th>Hours / month</th>
            <th style={{ textAlign: 'right' }}>Per hour</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ contract, money }) => (
            <tr key={contract.id}>
              <td style={{ fontWeight: 600 }}>{contract.student_name}</td>
              <td className="dash-num" style={{ color: 'var(--dash-muted)' }}>
                {formatDuration(contract.class_duration_minutes)}
              </td>
              <td className="dash-num" style={{ color: 'var(--dash-muted)' }}>
                {money.nominalHours}h
              </td>
              <td className="dash-num" style={{ textAlign: 'right', fontWeight: 700 }}>
                {formatVnd(money.hourlyRate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
