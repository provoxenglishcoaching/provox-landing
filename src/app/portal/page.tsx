import { redirect } from 'next/navigation';
import { getSession } from './lib/session';
import SignInForm from './components/SignInForm';

export default async function PortalHome() {
  const session = await getSession();
  if (session.role === 'coach') redirect('/portal/coach');
  if (session.role === 'student' && session.studentId) redirect('/portal/student');

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <SignInForm />
    </main>
  );
}
