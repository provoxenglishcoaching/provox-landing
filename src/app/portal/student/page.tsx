import { redirect } from 'next/navigation';
import { requireStudent } from '../lib/session';
import { getStudentById, getAssignmentsForStudent, getSubmissionsForStudent } from '../lib/db';
import { logout } from '../actions/auth';
import { toggleAssignment } from '../actions/student';
import WaveProgress from '../components/WaveProgress';
import AssignmentCard from '../components/AssignmentCard';
import SubmissionForm from '../components/SubmissionForm';
import SubmissionCard from '../components/SubmissionCard';

export default async function StudentDashboard() {
  const session = await requireStudent();

  const student = await getStudentById(session.studentId);
  if (!student) redirect('/portal/clear-session');

  const [assignments, submissions] = await Promise.all([
    getAssignmentsForStudent(student.id),
    getSubmissionsForStudent(student.id),
  ]);
  const upcoming = assignments.filter((a) => a.status !== 'completed');
  const completed = assignments.filter((a) => a.status === 'completed');
  const pct = assignments.length ? Math.round((completed.length / assignments.length) * 100) : 0;
  const firstName = student.name.split(' ')[0];

  return (
    <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <form action={logout}>
          <button
            type="submit"
            style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign out
          </button>
        </form>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, var(--portal-navy) 0%, #223a63 100%)',
          borderRadius: '20px',
          padding: '28px 26px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          boxShadow: 'var(--portal-shadow-lg)',
        }}
      >
        <WaveProgress
          percent={pct}
          size={92}
          showLabel
          bg="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.3)"
          labelColor="#fff"
        />
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '21px', fontFamily: 'var(--next-montserrat), sans-serif' }}>
            Welcome back, {firstName}
          </h2>
          <div style={{ fontFamily: 'var(--next-montserrat), sans-serif', fontWeight: 800, fontSize: '15px', color: 'var(--portal-turq)' }}>
            {completed.length} of {assignments.length} complete
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--portal-slate-200)' }}>
            Keep going — every session builds on the last.
          </p>
        </div>
      </div>

      {upcoming.length > 0 ? (
        <>
          <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-slate)', margin: '20px 0 10px' }}>
            To do
          </div>
          <div>
            {upcoming.map((a) => (
              <AssignmentCard key={a.id} assignment={a} onToggle={toggleAssignment.bind(null, a.id)} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7a93', fontSize: '13.5px', lineHeight: 1.6 }}>
          You&apos;re all caught up. Nothing outstanding right now.
        </div>
      )}

      {completed.length > 0 && (
        <>
          <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-slate)', margin: '20px 0 10px' }}>
            Completed
          </div>
          <div>
            {completed.map((a) => (
              <AssignmentCard key={a.id} assignment={a} onToggle={toggleAssignment.bind(null, a.id)} />
            ))}
          </div>
        </>
      )}

      <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-slate)', margin: '28px 0 10px' }}>
        Submit work
      </div>
      <SubmissionForm />

      {submissions.length > 0 && (
        <>
          <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-slate)', margin: '24px 0 10px' }}>
            Your submissions
          </div>
          <div>
            {submissions.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                feedbackSlot={
                  s.coach_feedback ? (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--portal-slate-200)', fontSize: '13px', color: '#4f5f7c' }}>
                      <strong style={{ color: 'var(--portal-navy)' }}>Coach feedback:</strong> {s.coach_feedback}
                    </div>
                  ) : null
                }
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
