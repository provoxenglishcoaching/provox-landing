import type { ContractRow } from '../lib/db';
import { formatDateShort } from '../lib/schedule';

export default function CompletedContractsList({
  contracts,
}: {
  contracts: { contract: ContractRow; classCount: number }[];
}) {
  if (contracts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7a93', fontSize: '13.5px', lineHeight: 1.6 }}>
        No completed contracts yet.
      </div>
    );
  }

  return (
    <div>
      {contracts.map(({ contract, classCount }) => (
        <details
          key={contract.id}
          style={{ border: '1px solid var(--portal-slate-200)', borderRadius: '12px', padding: '12px 16px', marginBottom: '10px' }}
        >
          <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--portal-navy)' }}>{contract.name}</span>
            <span style={{ fontSize: '12.5px', color: 'var(--portal-slate)' }}>
              Completed {contract.completed_date ? formatDateShort(contract.completed_date) : '—'}
            </span>
          </summary>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--portal-slate-200)', display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--foreground)' }}>
            <span>
              <strong>Number of classes:</strong> {classCount}
            </span>
            <span>
              <strong>Fee:</strong> {contract.monthly_fee}
            </span>
          </div>
        </details>
      ))}
    </div>
  );
}
