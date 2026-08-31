import { formatDuration } from '../lib/income';
import Avatar from './Avatar';
import EditableAvatar from './EditableAvatar';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-slate-200)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--next-montserrat), sans-serif', fontWeight: 800, fontSize: '19px', color: '#fff', lineHeight: 1.3 }}>
        {value}
      </div>
    </div>
  );
}

export default function StudentProfileBox({
  name,
  avatar,
  weeklyClasses,
  scheduleText,
  monthlyFee,
  classDurationMinutes,
  studentSince,
  onSelectAvatar,
}: {
  name: string;
  avatar: string;
  weeklyClasses: number | null;
  scheduleText: string;
  monthlyFee: string;
  classDurationMinutes: number | null;
  studentSince: string;
  /** Bound server action. Given one, the avatar gets a pencil badge. */
  onSelectAvatar?: (avatar: string) => Promise<void>;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--portal-navy) 0%, #223a63 100%)',
        borderRadius: '20px',
        padding: '22px 26px',
        marginBottom: '24px',
        boxShadow: 'var(--portal-shadow-lg)',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-turq)', marginBottom: '8px' }}>
        Student Profile
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
        {onSelectAvatar ? (
          <EditableAvatar avatar={avatar} name={name} size={54} onSelect={onSelectAvatar} />
        ) : (
          <Avatar avatar={avatar} name={name} size={54} />
        )}
        <div style={{ fontFamily: 'var(--next-montserrat), sans-serif', fontWeight: 800, fontSize: '28px', color: '#fff', lineHeight: 1.25 }}>
          {name}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '18px' }}>
        <Stat label="Weekly Classes" value={weeklyClasses ? String(weeklyClasses) : '—'} />
        <Stat label="Class Time" value={classDurationMinutes ? formatDuration(classDurationMinutes) : '—'} />
        <Stat label="Class Schedule" value={scheduleText || '—'} />
        <Stat label="Monthly Fee" value={monthlyFee || '—'} />
        <Stat label="Student Since" value={studentSince} />
      </div>
    </div>
  );
}
