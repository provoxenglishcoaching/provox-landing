import { redirect } from 'next/navigation';
import Image from 'next/image';
import { requireStudent } from '../lib/session';
import {
  getStudentById,
  getAssignmentsForStudent,
  getSubmissionsForStudent,
  getActiveContract,
  getScheduleSlots,
  getSessions,
  getCompletedContracts,
} from '../lib/db';
import { logout } from '../actions/auth';
import { toggleAssignment, changeMyAvatar } from '../actions/student';
import { formatDateShort, formatScheduleText } from '../lib/schedule';
import AssignmentCard from '../components/AssignmentCard';
import SubmissionForm from '../components/SubmissionForm';
import SubmissionCard from '../components/SubmissionCard';
import StudentProfileBox from '../components/StudentProfileBox';
import CurrentContractPanel from '../components/CurrentContractPanel';
import CompletedContractsList from '../components/CompletedContractsList';
import { Card, Badge, EmptyNote } from '../components/DashUI';

const sectionLabel: React.CSSProperties = {
  fontSize: '11.5px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--dash-muted)',
  margin: '22px 0 10px',
};

export default async function StudentDashboard() {
  const session = await requireStudent();

  const student = await getStudentById(session.studentId);
  if (!student) redirect('/login/clear-session');

  const [assignments, submissions, activeContract, completedContracts] = await Promise.all([
    getAssignmentsForStudent(student.id),
    getSubmissionsForStudent(student.id),
    getActiveContract(student.id),
    getCompletedContracts(student.id),
  ]);

  const [activeSlots, activeSessions, completedWithCounts] = await Promise.all([
    activeContract ? getScheduleSlots(activeContract.id) : Promise.resolve([]),
    activeContract ? getSessions(activeContract.id) : Promise.resolve([]),
    Promise.all(
      completedContracts.map(async (contract) => ({ contract, classCount: (await getSessions(contract.id)).length }))
    ),
  ]);

  const upcoming = assignments.filter((a) => a.status !== 'completed');
  const completed = assignments.filter((a) => a.status === 'completed');
  const firstName = student.name.split(' ')[0];
  const scheduleText = formatScheduleText(activeSlots.map((s) => ({ dayOfWeek: s.day_of_week, timeOfDay: s.time_of_day })));

  return (
    <div className="dash-body">
      <div className="dash-shell">
        <div className="dash-frame">
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <Image
              src="/logo-light.svg"
              alt="ProVox — Professional English Coaching"
              width={425}
              height={345}
              priority
              style={{ width: '104px', height: 'auto' }}
            />
            <form action={logout}>
              <button
                type="submit"
                style={{ background: '#fff', border: '1px solid var(--dash-line)', color: 'var(--dash-ink)', padding: '9px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign out
              </button>
            </form>
          </header>

          <h1
            style={{
              margin: '4px 0 22px',
              fontFamily: 'var(--next-montserrat), sans-serif',
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: 'var(--dash-ink)',
            }}
          >
            Welcome back, {firstName}
          </h1>

          <StudentProfileBox
            name={student.name}
            avatar={student.avatar}
            weeklyClasses={activeContract?.weekly_classes ?? null}
            scheduleText={scheduleText}
            monthlyFee={activeContract?.monthly_fee ?? ''}
            classDurationMinutes={activeContract?.class_duration_minutes ?? null}
            studentSince={formatDateShort(student.added_date)}
            onSelectAvatar={changeMyAvatar}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '18px', alignItems: 'start', marginTop: '22px' }} className="portal-coach-grid">
            {/* Explicit minmax(0, 1fr): the implicit `auto` track would size to
                the widest content inside and overflow on narrow screens. */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '18px' }}>
              <Card title="Current Contract">
                <CurrentContractPanel contract={activeContract} sessions={activeSessions} />
              </Card>

              <Card
                title="Homework"
                action={
                  assignments.length > 0 ? (
                    <Badge tone={completed.length === assignments.length ? 'good' : 'neutral'}>
                      {completed.length} of {assignments.length} complete
                    </Badge>
                  ) : undefined
                }
              >
                {upcoming.length > 0 ? (
                  <>
                    <div style={{ ...sectionLabel, marginTop: 0 }}>To do</div>
                    {upcoming.map((a) => (
                      <AssignmentCard key={a.id} assignment={a} onToggle={toggleAssignment.bind(null, a.id)} />
                    ))}
                  </>
                ) : (
                  <EmptyNote>You&apos;re all caught up. Nothing outstanding right now.</EmptyNote>
                )}

                {completed.length > 0 && (
                  <>
                    <div style={sectionLabel}>Completed</div>
                    {completed.map((a) => (
                      <AssignmentCard key={a.id} assignment={a} onToggle={toggleAssignment.bind(null, a.id)} />
                    ))}
                  </>
                )}

                <div style={sectionLabel}>Submit work</div>
                <SubmissionForm />

                {submissions.length > 0 && (
                  <>
                    <div style={sectionLabel}>Your submissions</div>
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
                  </>
                )}
              </Card>
            </div>

            <Card title="Finished Contracts">
              <CompletedContractsList contracts={completedWithCounts} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
