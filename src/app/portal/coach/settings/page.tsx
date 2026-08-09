import Link from 'next/link';
import { requireCoach } from '../../lib/session';
import ChangePasswordForm from '../../components/ChangePasswordForm';

export default async function CoachSettings() {
  await requireCoach();

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--next-montserrat), sans-serif', color: 'var(--portal-navy)', fontSize: '22px' }}>
          Settings
        </h1>
        <Link
          href="/portal/coach"
          style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
        >
          Back to dashboard
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--portal-slate-200)', borderRadius: '16px', boxShadow: 'var(--portal-shadow)', padding: '20px 22px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--portal-navy)' }}>Change master password</h2>
        <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#6b7a93' }}>
          This is the password you use to sign in as coach (with the code field left blank).
        </p>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
