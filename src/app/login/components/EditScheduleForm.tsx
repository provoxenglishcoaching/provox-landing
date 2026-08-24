'use client';

import { useActionState } from 'react';
import { updateContractSchedule, type ContractFormState } from '../actions/coach';
import ScheduleSlotFields from './ScheduleSlotFields';
import type { ScheduleSlot } from '../lib/schedule';

const initialState: ContractFormState = { error: '' };

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '11.5px',
  fontWeight: 700,
  color: '#4f5f7c',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '5px',
};

const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  border: '1px solid var(--portal-slate-200)',
  borderRadius: '8px',
  fontSize: '13.5px',
  background: '#fff',
};

export default function EditScheduleForm({
  contractId,
  weeklyClasses,
  monthlyFee,
  slots,
}: {
  contractId: string;
  weeklyClasses: number;
  monthlyFee: string;
  slots: ScheduleSlot[];
}) {
  const action = updateContractSchedule.bind(null, contractId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <details style={{ marginTop: '14px' }}>
      <summary style={{ cursor: 'pointer', fontSize: '12.5px', fontWeight: 700, color: 'var(--portal-navy-700)' }}>
        Edit schedule, class count, or fee
      </summary>
      <div style={{ background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px', marginTop: '10px' }}>
        <div style={{ fontSize: '12px', color: '#4f5f7c', marginBottom: '12px', lineHeight: 1.5 }}>
          Classes that already happened are left as-is. Everything from today onward will be regenerated to match what you save here.
        </div>
        {state.error && (
          <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
            {state.error}
          </div>
        )}
        <form action={formAction}>
          <ScheduleSlotFields defaultWeeklyClasses={weeklyClasses} defaultSlots={slots} />
          <div style={{ marginBottom: '12px' }}>
            <label style={fieldLabel}>Monthly fee</label>
            <input name="monthlyFee" type="text" defaultValue={monthlyFee} required maxLength={40} style={fieldInput} />
          </div>
          <button
            type="submit"
            disabled={pending}
            style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: pending ? 'default' : 'pointer' }}
          >
            {pending ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </details>
  );
}
