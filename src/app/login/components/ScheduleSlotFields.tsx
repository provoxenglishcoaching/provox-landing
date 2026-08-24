'use client';

import { useState } from 'react';
import { DAY_NAMES, type ScheduleSlot } from '../lib/schedule';

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

export default function ScheduleSlotFields({
  defaultWeeklyClasses = 1,
  defaultSlots = [],
}: {
  defaultWeeklyClasses?: number;
  defaultSlots?: ScheduleSlot[];
}) {
  const [count, setCount] = useState(defaultWeeklyClasses);

  return (
    <>
      <div style={{ marginBottom: '10px', maxWidth: '160px' }}>
        <label style={fieldLabel}>Weekly classes</label>
        <input
          name="weeklyClasses"
          type="number"
          min={1}
          max={14}
          value={count}
          onChange={(e) => {
            const n = Math.floor(Number(e.target.value));
            setCount(Number.isFinite(n) && n > 0 ? Math.min(14, n) : 1);
          }}
          required
          style={fieldInput}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={fieldLabel}>Class times</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px' }}>
              <select name={`day_${i}`} defaultValue={defaultSlots[i]?.dayOfWeek ?? ''} required style={fieldInput}>
                <option value="" disabled>
                  Day
                </option>
                {DAY_NAMES.map((day, idx) => (
                  <option key={idx} value={idx}>
                    {day}
                  </option>
                ))}
              </select>
              <input name={`time_${i}`} type="time" defaultValue={defaultSlots[i]?.timeOfDay ?? ''} required style={fieldInput} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
