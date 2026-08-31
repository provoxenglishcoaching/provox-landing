'use client';

import { useActionState } from 'react';
import { createContractForStudent, type ContractFormState } from '../actions/coach';
import ScheduleSlotFields from './ScheduleSlotFields';

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

export default function ContractSetupForm({
  studentId,
  firstName,
  isFirst,
}: {
  studentId: string;
  firstName: string;
  isFirst: boolean;
}) {
  const action = createContractForStudent.bind(null, studentId, firstName);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div style={{ background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px', margin: '16px 0 22px' }}>
      <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--portal-navy-700)', marginBottom: '12px' }}>
        {isFirst ? `Set up ${firstName}'s first contract` : `Start ${firstName}'s next contract`}
      </div>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          {state.error}
        </div>
      )}
      <form action={formAction}>
        <ScheduleSlotFields />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label style={fieldLabel}>Monthly fee (vnđ)</label>
            {/* step is measured from min, so min={1} would make 4000000 an
                invalid value. Both are round thousands to keep every real
                fee acceptable. */}
            <input name="monthlyFee" type="number" min={1000} step={1000} placeholder="6000000" required style={fieldInput} />
          </div>
          <div>
            <label style={fieldLabel}>Class length (minutes)</label>
            <input name="classDuration" type="number" min={15} max={480} step={15} defaultValue={60} required style={fieldInput} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div>
            <label style={fieldLabel}>First class date</label>
            <input name="firstDate" type="date" required style={fieldInput} />
          </div>
          <div>
            <label style={fieldLabel}>First class time</label>
            <input name="firstTime" type="time" required style={fieldInput} />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: pending ? 'default' : 'pointer' }}
        >
          {pending ? 'Creating…' : 'Create contract'}
        </button>
      </form>
    </div>
  );
}
