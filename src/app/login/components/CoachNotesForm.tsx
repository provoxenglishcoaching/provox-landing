'use client';

import { useRef, useState } from 'react';
import { saveStudentNotes } from '../actions/coach';

export default function CoachNotesForm({ studentId, initialNotes }: { studentId: string; initialNotes: string }) {
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const action = saveStudentNotes.bind(null, studentId);

  return (
    <div style={{ background: '#fffaf0', border: '1px solid #f0e2c0', borderRadius: '12px', padding: '16px', margin: '16px 0 22px' }}>
      <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8a6d1f', marginBottom: '8px' }}>
        Coach notes — private, students never see this
      </div>
      <form
        action={async (formData) => {
          await action(formData);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setSaved(true);
          timeoutRef.current = setTimeout(() => setSaved(false), 2000);
        }}
      >
        <textarea
          name="notes"
          defaultValue={initialNotes}
          placeholder="Goals, level, strengths/weaknesses, anything to remember…"
          style={{ width: '100%', minHeight: '90px', padding: '10px 12px', border: '1px solid #f0e2c0', borderRadius: '8px', fontSize: '13.5px', background: '#fff', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
          <button
            type="submit"
            style={{ background: '#8a6d1f', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
          >
            Save notes
          </button>
          {saved && <span style={{ fontSize: '12px', color: '#8a6d1f', fontWeight: 600 }}>Saved</span>}
        </div>
      </form>
    </div>
  );
}
