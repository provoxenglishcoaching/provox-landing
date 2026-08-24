import type { ContractRow, ContractSessionRow } from '../lib/db';
import type { ScheduleSlot } from '../lib/schedule';
import SessionsList from './SessionsList';
import EditScheduleForm from './EditScheduleForm';
import { togglePayment, finishContract } from '../actions/coach';

export default function ActiveContractPanel({
  contract,
  sessions,
  slots,
}: {
  contract: ContractRow;
  sessions: ContractSessionRow[];
  slots: ScheduleSlot[];
}) {
  return (
    <div style={{ border: '1px solid var(--portal-slate-200)', borderRadius: '14px', padding: '16px 18px', margin: '16px 0 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--portal-navy)' }}>{contract.name} — Current Contract</div>
        <form action={finishContract.bind(null, contract.id)}>
          <button
            type="submit"
            style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', borderRadius: '8px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
          >
            Complete contract
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px', fontSize: '13.5px', color: 'var(--foreground)' }}>
        <span>
          <strong>Monthly Fee:</strong> {contract.monthly_fee}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong>Payment Received:</strong>
          <span style={{ color: contract.payment_received ? 'var(--portal-ok)' : '#b0475c', fontWeight: 800, fontSize: '16px' }}>
            {contract.payment_received ? '✓' : '✗'}
          </span>
          <form action={togglePayment.bind(null, contract.id, contract.payment_received)}>
            <button
              type="submit"
              style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', borderRadius: '7px', padding: '5px 10px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              {contract.payment_received ? 'Mark unpaid' : 'Mark paid'}
            </button>
          </form>
        </div>
      </div>

      <SessionsList sessions={sessions} editable />

      <EditScheduleForm contractId={contract.id} weeklyClasses={contract.weekly_classes} monthlyFee={contract.monthly_fee} slots={slots} />
    </div>
  );
}
