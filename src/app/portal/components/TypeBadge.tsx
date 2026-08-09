import type { AssignmentType } from '../lib/db';

const STYLES: Record<AssignmentType, { background: string; color: string; label: string }> = {
  Homework: { background: 'var(--portal-navy)', color: '#fff', label: 'Homework' },
  Material: { background: 'var(--portal-slate-200)', color: 'var(--portal-navy)', label: 'Material' },
  Resource: { background: 'var(--portal-turq)', color: 'var(--portal-navy)', label: 'Resource' },
};

export default function TypeBadge({ type }: { type: AssignmentType }) {
  const s = STYLES[type];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10.5px',
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '4px 9px',
        borderRadius: '20px',
        background: s.background,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}
