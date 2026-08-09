import Link from 'next/link';
import { requireCoach } from '../lib/session';
import { listStudents, getProgressByStudent, getAssignmentsForStudent, getSubmissionsForStudent } from '../lib/db';
import { logout } from '../actions/auth';
import { removeStudent, removeAssignment, addAssignment } from '../actions/coach';
import WaveProgress from '../components/WaveProgress';
import AssignmentCard from '../components/AssignmentCard';
import AddStudentForm from '../components/AddStudentForm';
import CredentialsForm from '../components/CredentialsForm';
import SubmissionCard from '../components/SubmissionCard';
import FeedbackForm from '../components/FeedbackForm';

export default async function CoachDashboard({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  await requireCoach();
  const { student: selectedId } = await searchParams;

  const [students, progress] = await Promise.all([listStudents(), getProgressByStudent()]);
  const selected = selectedId ? students.find((s) => s.id === selectedId) : undefined;
  const [assignments, submissions] = selected
    ? await Promise.all([getAssignmentsForStudent(selected.id), getSubmissionsForStudent(selected.id)])
    : [[], []];
  const selectedProgress = selected ? progress[selected.id] ?? { total: 0, done: 0 } : { total: 0, done: 0 };

  return (
    <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--next-montserrat), sans-serif', color: 'var(--portal-navy)', fontSize: '22px' }}>
          Coach Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/portal/coach/settings"
            style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
          >
            Settings
          </Link>
          <form action={logout}>
            <button type="submit" style={{ background: 'transparent', border: '1px solid var(--portal-slate-200)', color: 'var(--portal-navy)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }} className="portal-coach-grid">
        <div style={{ background: '#fff', border: '1px solid var(--portal-slate-200)', borderRadius: '16px', boxShadow: 'var(--portal-shadow)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--portal-slate-200)' }}>
            <h2 style={{ margin: 0, fontSize: '15px', color: 'var(--portal-navy)' }}>Your Students</h2>
          </div>
          <div style={{ padding: '16px 18px' }}>
            {students.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 4px', color: '#6b7a93', fontSize: '13.5px' }}>
                No students enrolled yet.
              </div>
            )}
            {students.map((s) => {
              const p = progress[s.id] ?? { total: 0, done: 0 };
              const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
              const active = s.id === selected?.id;
              return (
                <Link
                  key={s.id}
                  href={`/portal/coach?student=${s.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 10px',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    textDecoration: 'none',
                    background: active ? 'var(--portal-turq-100)' : 'transparent',
                    border: `1px solid ${active ? 'var(--portal-turq)' : 'transparent'}`,
                  }}
                >
                  <WaveProgress percent={pct} size={38} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--portal-navy)' }}>{s.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--portal-slate)', marginTop: '1px' }}>
                      {p.done}/{p.total} complete ·{' '}
                      <span style={{ fontFamily: 'var(--next-montserrat), sans-serif', fontWeight: 800, background: 'var(--portal-navy)', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', letterSpacing: '0.04em' }}>
                        {s.code}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
            <AddStudentForm />
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--portal-slate-200)', borderRadius: '16px', boxShadow: 'var(--portal-shadow)' }}>
          <div style={{ padding: '16px 18px' }}>
            {!selected ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7a93', fontSize: '13.5px', lineHeight: 1.6 }}>
                Select a student on the left — or add your first one — to send materials and homework.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <WaveProgress percent={selectedProgress.total ? Math.round((selectedProgress.done / selectedProgress.total) * 100) : 0} size={56} showLabel />
                    <div>
                      <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--portal-navy)' }}>{selected.name}</h2>
                      <div style={{ fontSize: '12.5px', color: 'var(--portal-slate)', marginTop: '2px' }}>
                        {selectedProgress.done} of {selectedProgress.total} assignments complete
                      </div>
                    </div>
                  </div>
                  <form action={removeStudent.bind(null, selected.id)}>
                    <button type="submit" style={{ background: 'none', border: 'none', color: '#b0475c', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                      Remove student
                    </button>
                  </form>
                </div>

                <CredentialsForm studentId={selected.id} firstName={selected.name.split(' ')[0]} code={selected.code} />

                <form
                  action={addAssignment.bind(null, selected.id)}
                  style={{ background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px', margin: '18px 0 22px' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={fieldLabel}>Title</label>
                      <input name="title" type="text" placeholder="e.g. Practice: Handling Disagreement" required maxLength={90} style={fieldInput} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Type</label>
                      <select name="type" style={fieldInput} defaultValue="Homework">
                        <option value="Homework">Homework</option>
                        <option value="Material">Material</option>
                        <option value="Resource">Resource Link</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={fieldLabel}>Instructions / notes</label>
                    <textarea name="description" placeholder="What should they do with this?" style={{ ...fieldInput, resize: 'vertical', minHeight: '56px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={fieldLabel}>Link (optional)</label>
                      <input name="url" type="url" placeholder="https://…" style={fieldInput} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Due date (optional)</label>
                      <input name="dueDate" type="date" style={fieldInput} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
                  >
                    Send to {selected.name.split(' ')[0]}
                  </button>
                </form>

                {assignments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7a93', fontSize: '13.5px', lineHeight: 1.6 }}>
                    Nothing assigned yet. Use the form above to send the first one.
                  </div>
                ) : (
                  assignments.map((a) => (
                    <AssignmentCard key={a.id} assignment={a} onDelete={removeAssignment.bind(null, a.id)} />
                  ))
                )}

                <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--portal-slate)', margin: '24px 0 10px' }}>
                  Submissions
                </div>
                {submissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 16px', color: '#6b7a93', fontSize: '13.5px' }}>
                    {selected.name.split(' ')[0]}{' '}hasn&apos;t submitted anything yet.
                  </div>
                ) : (
                  submissions.map((s) => (
                    <SubmissionCard
                      key={s.id}
                      submission={s}
                      feedbackSlot={<FeedbackForm submissionId={s.id} initialFeedback={s.coach_feedback ?? ''} />}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

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
