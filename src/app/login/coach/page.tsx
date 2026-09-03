import Link from 'next/link';
import Image from 'next/image';
import { requireCoach } from '../lib/session';
import {
  listStudents,
  getProgressByStudent,
  getAssignmentsForStudent,
  getSubmissionsForStudent,
  getActiveContract,
  getScheduleSlots,
  getSessions,
  getCompletedContracts,
  getContractsWithCounts,
  getMonthlyIncome,
  getSessionTotals,
  countStudents,
  getLibraryDecks,
  getCardsForDeck,
  getDeckRecipients,
  getDecksForStudent,
} from '../lib/db';
import { logout } from '../actions/auth';
import { removeStudent, removeAssignment, removeSubmission, setStudentAvatar } from '../actions/coach';
import { formatDateShort, formatScheduleText } from '../lib/schedule';
import { contractFinancials, formatVnd, formatPercent } from '../lib/income';
import WaveProgress from '../components/WaveProgress';
import AssignmentCard from '../components/AssignmentCard';
import AddStudentForm from '../components/AddStudentForm';
import CredentialsForm from '../components/CredentialsForm';
import AssignForm from '../components/AssignForm';
import SubmissionCard from '../components/SubmissionCard';
import FeedbackForm from '../components/FeedbackForm';
import StudentProfileBox from '../components/StudentProfileBox';
import ContractSetupForm from '../components/ContractSetupForm';
import ActiveContractPanel from '../components/ActiveContractPanel';
import CompletedContractsList from '../components/CompletedContractsList';
import CoachNotesForm from '../components/CoachNotesForm';
import Avatar from '../components/Avatar';
import MonthlyIncomeTable from '../components/MonthlyIncomeTable';
import HourlyRateTable from '../components/HourlyRateTable';
import FinishingSoonTable from '../components/FinishingSoonTable';
import LibraryDecks from '../components/LibraryDecks';
import { Card, Stat, Tabs, EmptyNote, COACH_TABS } from '../components/DashUI';

const sectionLabel: React.CSSProperties = {
  fontSize: '11.5px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--dash-muted)',
  margin: '24px 0 10px',
};

async function OverviewTab() {
  const [students, activeContracts, totals, monthly] = await Promise.all([
    countStudents(),
    getContractsWithCounts('active'),
    getSessionTotals(),
    getMonthlyIncome(),
  ]);

  const money = activeContracts.map((c) =>
    contractFinancials({
      feeAmount: c.monthly_fee_amount,
      weeklyClasses: c.weekly_classes,
      classDurationMinutes: c.class_duration_minutes,
      rescheduledCount: c.rescheduled_sessions,
    })
  );

  const monthlyIncome = activeContracts.reduce((sum, c) => sum + c.monthly_fee_amount, 0);
  const netIncome = money.reduce((sum, m) => sum + m.effectiveMonthly, 0);
  const lost = monthlyIncome - netIncome;
  const rescheduleRate = totals.total > 0 ? totals.rescheduled / totals.total : 0;

  return (
    <>
      <div className="dash-stats">
        <Stat
          label="Total Students"
          value={String(students)}
          hint={`${activeContracts.length} on an active contract`}
        />
        <Stat
          label="Monthly Income"
          value={formatVnd(monthlyIncome)}
          hint="Billed across active contracts"
        />
        <Stat
          label="Reschedule Rate"
          value={formatPercent(rescheduleRate)}
          badge={
            totals.total === 0
              ? undefined
              : { text: `${totals.rescheduled} of ${totals.total}`, tone: rescheduleRate > 0.1 ? 'bad' : 'good' }
          }
          hint="Classes moved, all time"
        />
        <Stat
          label="Net Income"
          value={formatVnd(netIncome)}
          badge={
            lost > 0.5
              ? { text: `↘ ${formatVnd(lost)}`, tone: 'bad' }
              : { text: 'On schedule', tone: 'good' }
          }
          hint="Fees spread over the time they really take"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '18px', alignItems: 'start' }} className="portal-coach-grid">
        {/* Explicit minmax(0, 1fr): the implicit `auto` track would size to
            the widest table inside and overflow this column on narrow screens. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '18px' }}>
          <Card title="Monthly Income Tracker">
            <MonthlyIncomeTable rows={monthly} />
          </Card>
          <Card title="Contracts Finishing Soon">
            <FinishingSoonTable contracts={activeContracts} />
          </Card>
        </div>

        <Card title="Effective Hourly Rate">
          <HourlyRateTable contracts={activeContracts} />
        </Card>
      </div>

      <div style={{ marginTop: '18px' }}>
        <Card title="Flashcard Library">
          <LibraryCard />
        </Card>
      </div>
    </>
  );
}

/**
 * The master decks, with their cards and the students already holding a copy.
 * A library is a handful of decks, so loading their cards up front is cheaper
 * than a round trip each time one is expanded.
 */
async function LibraryCard() {
  const [decks, students] = await Promise.all([getLibraryDecks(), listStudents()]);

  const loaded = await Promise.all(
    decks.map(async (deck) => ({
      id: deck.id,
      cards: await getCardsForDeck(deck.id),
      recipients: await getDeckRecipients(deck.id),
    }))
  );

  return (
    <LibraryDecks
      decks={decks}
      cardsByDeck={Object.fromEntries(loaded.map((d) => [d.id, d.cards]))}
      recipientsByDeck={Object.fromEntries(loaded.map((d) => [d.id, d.recipients]))}
      students={students.map((s) => ({ id: s.id, name: s.name }))}
    />
  );
}

async function StudentsTab({ selectedId }: { selectedId?: string }) {
  const [students, progress] = await Promise.all([listStudents(), getProgressByStudent()]);
  const selected = selectedId ? students.find((s) => s.id === selectedId) : undefined;

  const [assignments, submissions, activeContract, completedContracts, decks] = selected
    ? await Promise.all([
        getAssignmentsForStudent(selected.id),
        getSubmissionsForStudent(selected.id),
        getActiveContract(selected.id),
        getCompletedContracts(selected.id),
        getDecksForStudent(selected.id),
      ])
    : [[], [], undefined, [], []];

  const [activeSlots, activeSessions, completedWithCounts] = await Promise.all([
    activeContract ? getScheduleSlots(activeContract.id) : Promise.resolve([]),
    activeContract ? getSessions(activeContract.id) : Promise.resolve([]),
    Promise.all(
      completedContracts.map(async (contract) => ({ contract, classCount: (await getSessions(contract.id)).length }))
    ),
  ]);

  const selectedProgress = selected ? progress[selected.id] ?? { total: 0, done: 0 } : { total: 0, done: 0 };
  const scheduleText = formatScheduleText(activeSlots.map((s) => ({ dayOfWeek: s.day_of_week, timeOfDay: s.time_of_day })));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '18px', alignItems: 'start', marginTop: '22px' }} className="portal-coach-grid">
      <Card padded={false}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--dash-line)' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontFamily: 'var(--next-montserrat), sans-serif', color: 'var(--dash-ink)' }}>
            Your Students
          </h2>
        </div>
        <div style={{ padding: '16px 18px' }}>
          {students.length === 0 && <EmptyNote>No students enrolled yet.</EmptyNote>}
          {students.map((s) => {
            const active = s.id === selected?.id;
            return (
              <Link
                key={s.id}
                href={`/login/coach?tab=students&student=${s.id}`}
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
                <Avatar avatar={s.avatar} name={s.name} size={38} />
                <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--dash-ink)' }}>{s.name}</div>
              </Link>
            );
          })}
          <AddStudentForm />
        </div>
      </Card>

      <Card>
        {!selected ? (
          <EmptyNote>Select a student on the left — or add your first one — to send materials and homework.</EmptyNote>
        ) : (
          /*
            Keyed on the student so switching students remounts this whole
            panel. Without it React reuses the mounted client components --
            they sit at the same place in the tree with the same type -- and
            their uncontrolled `defaultValue` inputs keep the previous
            student's values while their bound server actions stay bound to
            the previous student's id, so an edit saves against the wrong one.
          */
          <div key={selected.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <WaveProgress percent={selectedProgress.total ? Math.round((selectedProgress.done / selectedProgress.total) * 100) : 0} size={56} showLabel />
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--next-montserrat), sans-serif', color: 'var(--dash-ink)' }}>
                    {selected.name}
                  </h2>
                  <div style={{ fontSize: '12.5px', color: 'var(--dash-muted)', marginTop: '2px' }}>
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

            <StudentProfileBox
              name={selected.name}
              avatar={selected.avatar}
              weeklyClasses={activeContract?.weekly_classes ?? null}
              scheduleText={scheduleText}
              monthlyFee={activeContract?.monthly_fee ?? ''}
              classDurationMinutes={activeContract?.class_duration_minutes ?? null}
              studentSince={formatDateShort(selected.added_date)}
              onSelectAvatar={setStudentAvatar.bind(null, selected.id)}
            />

            {activeContract ? (
              /* Keyed for the same reason as the panel above: completing one
                 contract and starting the next must not leave the edit form
                 bound to the finished contract. */
              <ActiveContractPanel
                key={activeContract.id}
                contract={activeContract}
                sessions={activeSessions}
                slots={activeSlots.map((s) => ({ dayOfWeek: s.day_of_week, timeOfDay: s.time_of_day }))}
              />
            ) : (
              <ContractSetupForm studentId={selected.id} firstName={selected.name.split(' ')[0]} isFirst={completedContracts.length === 0} />
            )}

            <CoachNotesForm studentId={selected.id} initialNotes={selected.coach_notes} />

            <AssignForm studentId={selected.id} firstName={selected.name.split(' ')[0]} />

            {assignments.length === 0 ? (
              <EmptyNote>Nothing assigned yet. Use the form above to send the first one.</EmptyNote>
            ) : (
              assignments.map((a) => <AssignmentCard key={a.id} assignment={a} onDelete={removeAssignment.bind(null, a.id)} />)
            )}

            <div style={sectionLabel}>Submissions</div>
            {submissions.length === 0 ? (
              <EmptyNote>{selected.name.split(' ')[0]} hasn&apos;t submitted anything yet.</EmptyNote>
            ) : (
              submissions.map((s) => (
                <SubmissionCard
                  key={s.id}
                  submission={s}
                  feedbackSlot={<FeedbackForm submissionId={s.id} initialFeedback={s.coach_feedback ?? ''} />}
                  onDelete={removeSubmission.bind(null, s.id)}
                />
              ))
            )}

            <div style={sectionLabel}>Flashcards</div>
            {decks.length === 0 ? (
              <EmptyNote>
                No decks yet. Send one from the Flashcard Library on the Overview tab.
              </EmptyNote>
            ) : (
              <div style={{ display: 'grid', gap: '6px' }}>
                {decks.map((deck) => (
                  <div key={deck.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 12px', border: '1px solid var(--dash-line)', borderRadius: '10px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--dash-ink)' }}>
                      {deck.name}
                      {deck.source_deck_id && (
                        <span style={{ fontWeight: 600, color: 'var(--portal-slate)', fontSize: '11.5px' }}> · sent by you</span>
                      )}
                    </span>
                    <span style={{ color: 'var(--dash-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {deck.mastered_count} / {deck.card_count} learned
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={sectionLabel}>Completed Contracts</div>
            <CompletedContractsList contracts={completedWithCounts} />
          </div>
        )}
      </Card>
    </div>
  );
}

export default async function CoachDashboard({
  searchParams,
}: {
  searchParams: Promise<{ student?: string; tab?: string }>;
}) {
  await requireCoach();
  const { student: selectedId, tab } = await searchParams;
  const activeTab = tab === 'students' ? 'students' : 'overview';

  return (
    <div className="dash-body">
      <div className="dash-shell">
        <div className="dash-frame">
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <Link href="/login/coach" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              {/* The same full lockup the student sign-in screen uses. */}
              <Image
                src="/logo-vertical.png"
                alt="ProVox — English Coaching"
                width={1178}
                height={951}
                priority
                style={{ width: '104px', height: 'auto' }}
              />
            </Link>

            <Tabs active={activeTab} tabs={COACH_TABS} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href="/login/coach/settings"
                style={{ background: '#fff', border: '1px solid var(--dash-line)', color: 'var(--dash-ink)', padding: '9px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}
              >
                Settings
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  style={{ background: '#fff', border: '1px solid var(--dash-line)', color: 'var(--dash-ink)', padding: '9px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign out
                </button>
              </form>
            </div>
          </header>

          <h1
            style={{
              margin: '4px 0 0',
              fontFamily: 'var(--next-montserrat), sans-serif',
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: 'var(--dash-ink)',
            }}
          >
            {activeTab === 'overview' ? 'Coaching Overview' : 'Students'}
          </h1>

          {activeTab === 'overview' ? <OverviewTab /> : <StudentsTab selectedId={selectedId} />}
        </div>
      </div>
    </div>
  );
}
