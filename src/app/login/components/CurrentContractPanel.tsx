import type { ContractRow, ContractSessionRow } from '../lib/db';
import SessionsList from './SessionsList';

export default function CurrentContractPanel({
  contract,
  sessions,
}: {
  contract: ContractRow | undefined;
  sessions: ContractSessionRow[];
}) {
  if (!contract) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7a93', fontSize: '13.5px', lineHeight: 1.6 }}>
        Your coach hasn&apos;t set up a contract yet — check back soon.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', margin: '4px 0 14px', fontSize: '14px', color: 'var(--foreground)' }}>
        <span>
          <strong>Monthly Fee:</strong> {contract.monthly_fee}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong>Payment Received:</strong>
          <span style={{ color: contract.payment_received ? 'var(--portal-ok)' : '#b0475c', fontWeight: 800, fontSize: '17px' }}>
            {contract.payment_received ? '✓' : '✗'}
          </span>
        </span>
      </div>
      <SessionsList sessions={sessions} />
    </div>
  );
}
