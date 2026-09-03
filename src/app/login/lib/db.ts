import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { ScheduleSlot, GeneratedSession } from './schedule';
import { INCOME_TRACKING_START } from './income';

// Lazy: neon() validates the connection string at call time, and Next.js
// evaluates this module while collecting page data even for dynamic routes.
// Eagerly calling neon() at import time breaks the build when DATABASE_URL
// isn't set yet (e.g. before Vercel Postgres is provisioned).
let _sql: NeonQueryFunction<false, false> | undefined;

function db(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  db()(...args)) as NeonQueryFunction<false, false>;

export interface SettingsRow {
  id: number;
  master_password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
}

export interface StudentRow {
  id: string;
  name: string;
  code: string;
  password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
  added_date: string;
  coach_notes: string;
  /** Id of a file in public/avatars; empty until one is chosen. */
  avatar: string;
}

export type AssignmentType = 'Homework' | 'Material' | 'Resource';
export type AssignmentStatus = 'assigned' | 'completed';

export interface AssignmentRow {
  id: string;
  student_id: string;
  title: string;
  type: AssignmentType;
  description: string;
  url: string;
  file_url: string | null;
  file_name: string | null;
  due_date: string | null;
  date_assigned: string;
  status: AssignmentStatus;
  completed_date: string | null;
}

export interface ProgressCount {
  total: number;
  done: number;
}

export type SubmissionStatus = 'submitted' | 'reviewed';

export interface SubmissionRow {
  id: string;
  student_id: string;
  title: string;
  body_text: string;
  file_url: string | null;
  file_name: string | null;
  date_submitted: string;
  status: SubmissionStatus;
  coach_feedback: string | null;
}

export type ContractStatus = 'active' | 'completed';

export interface ContractRow {
  id: string;
  student_id: string;
  contract_number: number;
  name: string;
  weekly_classes: number;
  /** Display string. `monthly_fee_amount` is what the income maths uses. */
  monthly_fee: string;
  monthly_fee_amount: number;
  class_duration_minutes: number;
  status: ContractStatus;
  payment_received: boolean;
  start_date: string;
  completed_date: string | null;
  created_at: string;
}

export interface ContractScheduleSlotRow {
  id: string;
  contract_id: string;
  day_of_week: number;
  time_of_day: string;
  sort_order: number;
}

export type SessionStatus = 'scheduled' | 'completed' | 'rescheduled';

export interface ContractSessionRow {
  id: string;
  contract_id: string;
  session_date: string;
  time_of_day: string;
  sort_order: number;
  status: SessionStatus;
  reschedule_source_id: string | null;
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

// The neon serverless driver returns Postgres `date`/`timestamptz` columns as
// native JS Date objects, not strings, regardless of how the row is typed
// here. Left unconverted, a Date object rendered directly in JSX throws
// ("Objects are not valid as a React child"). Normalize at the query
// boundary so every StudentRow/AssignmentRow field really is the string
// its type says it is.
function toDateOnly(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) {
    // Use local getters, not toISOString(): the driver constructs these Date
    // objects at local midnight, so converting through UTC would roll the
    // calendar date back a day on any host timezone ahead of UTC (e.g. ICT/UTC+7).
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value);
}

function normalizeStudent(row: StudentRow): StudentRow {
  return { ...row, added_date: toDateOnly(row.added_date)! };
}

function normalizeContract<T extends ContractRow>(row: T): T {
  const createdAt = row.created_at as unknown;
  return {
    ...row,
    start_date: toDateOnly(row.start_date)!,
    completed_date: toDateOnly(row.completed_date),
    created_at: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt),
    // Postgres `numeric` comes back off the driver as a string, and every
    // income figure downstream does arithmetic on it.
    monthly_fee_amount: Number(row.monthly_fee_amount ?? 0),
  };
}

function normalizeSession(row: ContractSessionRow): ContractSessionRow {
  return { ...row, session_date: toDateOnly(row.session_date)! };
}

function normalizeAssignment(row: AssignmentRow): AssignmentRow {
  return {
    ...row,
    due_date: toDateOnly(row.due_date),
    date_assigned: toDateOnly(row.date_assigned)!,
    completed_date: toDateOnly(row.completed_date),
  };
}

// timestamptz has no local-midnight ambiguity like `date` does (it's a real
// instant), so toISOString() is correct here -- unlike toDateOnly() above.
function normalizeSubmission(row: SubmissionRow): SubmissionRow {
  const value = row.date_submitted as unknown;
  return { ...row, date_submitted: value instanceof Date ? value.toISOString() : String(value) };
}

export async function getSettings(): Promise<SettingsRow> {
  const rows = await sql`select * from settings where id = 1` as SettingsRow[];
  return rows[0];
}

export async function bootstrapMasterPassword(hash: string): Promise<void> {
  await sql`update settings set master_password_hash = ${hash} where id = 1`;
}

export async function recordSettingsLoginResult(next: { failedAttempts: number; lockedUntil: string | null }): Promise<void> {
  await sql`update settings set failed_attempts = ${next.failedAttempts}, locked_until = ${next.lockedUntil} where id = 1`;
}

export async function updateMasterPasswordHash(hash: string): Promise<void> {
  await sql`update settings set master_password_hash = ${hash}, failed_attempts = 0, locked_until = null where id = 1`;
}

export async function getStudentByCode(code: string): Promise<StudentRow | undefined> {
  const rows = await sql`select * from students where upper(code) = upper(${code})` as StudentRow[];
  return rows[0] ? normalizeStudent(rows[0]) : undefined;
}

export async function getStudentById(id: string): Promise<StudentRow | undefined> {
  const rows = await sql`select * from students where id = ${id}` as StudentRow[];
  return rows[0] ? normalizeStudent(rows[0]) : undefined;
}

export async function recordStudentLoginResult(studentId: string, next: { failedAttempts: number; lockedUntil: string | null }): Promise<void> {
  await sql`update students set failed_attempts = ${next.failedAttempts}, locked_until = ${next.lockedUntil} where id = ${studentId}`;
}

export async function listStudents(): Promise<StudentRow[]> {
  const rows = await sql`select * from students order by added_date desc, name asc` as StudentRow[];
  return rows.map(normalizeStudent);
}

export async function createStudent(name: string, code: string, passwordHash: string): Promise<StudentRow> {
  const id = newId('stu');
  const rows = await sql`
    insert into students (id, name, code, password_hash)
    values (${id}, ${name}, ${code}, ${passwordHash})
    returning *
  ` as StudentRow[];
  return normalizeStudent(rows[0]);
}

export async function deleteStudent(id: string): Promise<void> {
  await sql`delete from students where id = ${id}`;
}

// passwordHash === null leaves the existing password untouched (code-only edit) --
// once a password is hashed there is no plaintext to redisplay or conditionally
// "keep", so the caller must explicitly choose to reset it or not.
export async function updateStudentCredentials(id: string, code: string, passwordHash: string | null): Promise<void> {
  if (passwordHash) {
    await sql`update students set code = ${code}, password_hash = ${passwordHash} where id = ${id}`;
  } else {
    await sql`update students set code = ${code} where id = ${id}`;
  }
}

export async function updateStudentNotes(id: string, notes: string): Promise<void> {
  await sql`update students set coach_notes = ${notes} where id = ${id}`;
}

export async function updateStudentAvatar(id: string, avatar: string): Promise<void> {
  await sql`update students set avatar = ${avatar} where id = ${id}`;
}

export async function getProgressByStudent(): Promise<Record<string, ProgressCount>> {
  const rows = await sql`
    select student_id,
           count(*)::int as total,
           count(*) filter (where status = 'completed')::int as done
    from assignments
    group by student_id
  ` as { student_id: string; total: number; done: number }[];
  const map: Record<string, ProgressCount> = {};
  for (const row of rows) map[row.student_id] = { total: row.total, done: row.done };
  return map;
}

export async function getAssignmentsForStudent(studentId: string): Promise<AssignmentRow[]> {
  const rows = await sql`
    select * from assignments
    where student_id = ${studentId}
    order by (status = 'completed') asc, coalesce(due_date, '9999-12-31') asc
  ` as AssignmentRow[];
  return rows.map(normalizeAssignment);
}

export async function createAssignment(input: {
  studentId: string;
  title: string;
  type: AssignmentType;
  description: string;
  url: string;
  fileUrl: string | null;
  fileName: string | null;
  dueDate: string | null;
}): Promise<void> {
  const id = newId('as');
  await sql`
    insert into assignments (id, student_id, title, type, description, url, file_url, file_name, due_date)
    values (${id}, ${input.studentId}, ${input.title}, ${input.type}, ${input.description}, ${input.url}, ${input.fileUrl}, ${input.fileName}, ${input.dueDate})
  `;
}

export async function deleteAssignment(id: string): Promise<void> {
  await sql`delete from assignments where id = ${id}`;
}

export async function getAssignmentById(id: string): Promise<AssignmentRow | undefined> {
  const rows = await sql`select * from assignments where id = ${id}` as AssignmentRow[];
  return rows[0] ? normalizeAssignment(rows[0]) : undefined;
}

export async function setAssignmentStatus(id: string, status: AssignmentStatus, completedDate: string | null): Promise<void> {
  await sql`update assignments set status = ${status}, completed_date = ${completedDate} where id = ${id}`;
}

export async function createSubmission(input: {
  studentId: string;
  title: string;
  bodyText: string;
  fileUrl: string | null;
  fileName: string | null;
}): Promise<void> {
  const id = newId('sub');
  await sql`
    insert into submissions (id, student_id, title, body_text, file_url, file_name)
    values (${id}, ${input.studentId}, ${input.title}, ${input.bodyText}, ${input.fileUrl}, ${input.fileName})
  `;
}

export async function getSubmissionsForStudent(studentId: string): Promise<SubmissionRow[]> {
  const rows = await sql`
    select * from submissions where student_id = ${studentId} order by date_submitted desc
  ` as SubmissionRow[];
  return rows.map(normalizeSubmission);
}

export async function getSubmissionById(id: string): Promise<SubmissionRow | undefined> {
  const rows = await sql`select * from submissions where id = ${id}` as SubmissionRow[];
  return rows[0] ? normalizeSubmission(rows[0]) : undefined;
}

export async function deleteSubmission(id: string): Promise<void> {
  await sql`delete from submissions where id = ${id}`;
}

export async function setSubmissionFeedback(id: string, feedback: string): Promise<void> {
  await sql`update submissions set coach_feedback = ${feedback}, status = 'reviewed' where id = ${id}`;
}

export async function getActiveContract(studentId: string): Promise<ContractRow | undefined> {
  const rows = await sql`
    select * from contracts where student_id = ${studentId} and status = 'active'
    order by contract_number desc limit 1
  ` as ContractRow[];
  return rows[0] ? normalizeContract(rows[0]) : undefined;
}

export async function getCompletedContracts(studentId: string): Promise<ContractRow[]> {
  const rows = await sql`
    select * from contracts where student_id = ${studentId} and status = 'completed'
    order by contract_number desc
  ` as ContractRow[];
  return rows.map(normalizeContract);
}

export async function getContractById(id: string): Promise<ContractRow | undefined> {
  const rows = await sql`select * from contracts where id = ${id}` as ContractRow[];
  return rows[0] ? normalizeContract(rows[0]) : undefined;
}

export async function getScheduleSlots(contractId: string): Promise<ContractScheduleSlotRow[]> {
  const rows = await sql`
    select * from contract_schedule_slots where contract_id = ${contractId} order by sort_order asc
  ` as ContractScheduleSlotRow[];
  return rows;
}

export async function getSessions(contractId: string): Promise<ContractSessionRow[]> {
  const rows = await sql`
    select * from contract_sessions where contract_id = ${contractId} order by sort_order asc
  ` as ContractSessionRow[];
  return rows.map(normalizeSession);
}

// Creates the contract row plus its schedule slots and generated sessions.
// Not wrapped in a transaction -- matches the rest of this file, which
// accepts the same small inconsistency window on multi-insert operations
// (see createAssignment's blob-then-row sequencing).
export async function createContract(input: {
  studentId: string;
  studentFirstName: string;
  weeklyClasses: number;
  monthlyFee: string;
  monthlyFeeAmount: number;
  classDurationMinutes: number;
  slots: ScheduleSlot[];
  sessions: GeneratedSession[];
}): Promise<ContractRow> {
  const numberRows = await sql`
    select coalesce(max(contract_number), 0) + 1 as next from contracts where student_id = ${input.studentId}
  ` as { next: number }[];
  const contractNumber = numberRows[0].next;
  const name = `${input.studentFirstName}-${String(contractNumber).padStart(3, '0')}`;
  const id = newId('con');
  const startDate = input.sessions[0]?.date ?? new Date().toISOString().slice(0, 10);

  const rows = await sql`
    insert into contracts (
      id, student_id, contract_number, name, weekly_classes,
      monthly_fee, monthly_fee_amount, class_duration_minutes, start_date
    )
    values (
      ${id}, ${input.studentId}, ${contractNumber}, ${name}, ${input.weeklyClasses},
      ${input.monthlyFee}, ${input.monthlyFeeAmount}, ${input.classDurationMinutes}, ${startDate}
    )
    returning *
  ` as ContractRow[];

  await replaceScheduleSlots(id, input.slots);
  await insertSessions(id, input.sessions, 0);

  return normalizeContract(rows[0]);
}

export async function replaceScheduleSlots(contractId: string, slots: ScheduleSlot[]): Promise<void> {
  await sql`delete from contract_schedule_slots where contract_id = ${contractId}`;
  for (let i = 0; i < slots.length; i++) {
    await sql`
      insert into contract_schedule_slots (id, contract_id, day_of_week, time_of_day, sort_order)
      values (${newId('slot')}, ${contractId}, ${slots[i].dayOfWeek}, ${slots[i].timeOfDay}, ${i})
    `;
  }
}

export async function insertSessions(contractId: string, sessions: GeneratedSession[], startSortOrder: number): Promise<void> {
  for (let i = 0; i < sessions.length; i++) {
    await sql`
      insert into contract_sessions (id, contract_id, session_date, time_of_day, sort_order)
      values (${newId('sess')}, ${contractId}, ${sessions[i].date}, ${sessions[i].time}, ${startSortOrder + i})
    `;
  }
}

export async function deleteSessionsFrom(contractId: string, fromDateInclusive: string): Promise<void> {
  await sql`delete from contract_sessions where contract_id = ${contractId} and session_date >= ${fromDateInclusive}`;
}


export async function updateContractDetails(
  id: string,
  weeklyClasses: number,
  monthlyFee: string,
  monthlyFeeAmount: number,
  classDurationMinutes: number
): Promise<void> {
  await sql`
    update contracts
       set weekly_classes = ${weeklyClasses},
           monthly_fee = ${monthlyFee},
           monthly_fee_amount = ${monthlyFeeAmount},
           class_duration_minutes = ${classDurationMinutes}
     where id = ${id}
  `;
}

export async function updateSessionDateTime(id: string, date: string, time: string): Promise<void> {
  await sql`update contract_sessions set session_date = ${date}, time_of_day = ${time} where id = ${id}`;
}

export async function getSessionById(id: string): Promise<ContractSessionRow | undefined> {
  const rows = await sql`select * from contract_sessions where id = ${id}` as ContractSessionRow[];
  return rows[0] ? normalizeSession(rows[0]) : undefined;
}

export async function setSessionStatus(id: string, status: SessionStatus): Promise<void> {
  await sql`update contract_sessions set status = ${status} where id = ${id}`;
}

// Inserts the makeup class created when a session is marked "rescheduled",
// linking it back to the session it makes up for.
export async function insertMakeupSession(
  contractId: string,
  session: GeneratedSession,
  sortOrder: number,
  sourceSessionId: string
): Promise<void> {
  await sql`
    insert into contract_sessions (id, contract_id, session_date, time_of_day, sort_order, reschedule_source_id)
    values (${newId('sess')}, ${contractId}, ${session.date}, ${session.time}, ${sortOrder}, ${sourceSessionId})
  `;
}

// Removes the makeup class chained off a session when its "rescheduled"
// status is undone. ON DELETE CASCADE on reschedule_source_id takes care of
// any further makeup classes chained off that one in turn.
export async function deleteMakeupSessionsFor(sourceSessionId: string): Promise<void> {
  await sql`delete from contract_sessions where reschedule_source_id = ${sourceSessionId}`;
}

export async function togglePaymentReceived(id: string, received: boolean): Promise<void> {
  await sql`update contracts set payment_received = ${received} where id = ${id}`;
}

export interface ContractWithCounts extends ContractRow {
  student_name: string;
  total_sessions: number;
  completed_sessions: number;
  rescheduled_sessions: number;
  remaining_sessions: number;
  last_session_date: string | null;
}

/** Every contract of a given status, with its session tallies rolled up. */
export async function getContractsWithCounts(status: ContractStatus): Promise<ContractWithCounts[]> {
  const rows = await sql`
    select c.*,
           s.name as student_name,
           count(cs.id)::int as total_sessions,
           count(cs.id) filter (where cs.status = 'completed')::int as completed_sessions,
           count(cs.id) filter (where cs.status = 'rescheduled')::int as rescheduled_sessions,
           count(cs.id) filter (where cs.status = 'scheduled')::int as remaining_sessions,
           max(cs.session_date) as last_session_date
      from contracts c
      join students s on s.id = c.student_id
      left join contract_sessions cs on cs.contract_id = c.id
     where c.status = ${status}
     group by c.id, s.name
     order by s.name asc
  ` as ContractWithCounts[];
  return rows.map((row) => ({
    ...normalizeContract(row),
    last_session_date: toDateOnly(row.last_session_date),
  }));
}

export interface MonthlyIncomeRow {
  month: string;
  classes_completed: number;
  hours: number;
  income: number;
}

/**
 * Money actually banked, month by month: a class counts only once it has
 * been taught *and* its contract is marked paid. Each such class earns its
 * contract's fee divided by the classes that fee buys, so a month in which
 * reschedules pushed classes out earns less -- the whole point of tracking
 * it this way. Unpaid contracts contribute nothing until the payment is
 * ticked, at which point their taught classes appear.
 */
export async function getMonthlyIncome(): Promise<MonthlyIncomeRow[]> {
  const rows = await sql`
    select to_char(cs.session_date, 'YYYY-MM') as month,
           count(*)::int as classes_completed,
           sum(c.class_duration_minutes) / 60.0 as hours,
           sum(c.monthly_fee_amount / greatest(c.weekly_classes * 4, 1)) as income
      from contract_sessions cs
      join contracts c on c.id = cs.contract_id
     where cs.status = 'completed'
       and c.payment_received = true
       and cs.session_date >= ${INCOME_TRACKING_START}
     group by 1
     order by 1 desc
  ` as { month: string; classes_completed: number; hours: string; income: string }[];
  return rows.map((r) => ({
    month: r.month,
    classes_completed: r.classes_completed,
    hours: Number(r.hours),
    income: Number(r.income),
  }));
}

export interface SessionTotals {
  total: number;
  rescheduled: number;
  completed: number;
}

export async function getSessionTotals(): Promise<SessionTotals> {
  const rows = await sql`
    select count(*)::int as total,
           count(*) filter (where status = 'rescheduled')::int as rescheduled,
           count(*) filter (where status = 'completed')::int as completed
      from contract_sessions
  ` as SessionTotals[];
  return rows[0] ?? { total: 0, rescheduled: 0, completed: 0 };
}

export async function countStudents(): Promise<number> {
  const rows = await sql`select count(*)::int as n from students` as { n: number }[];
  return rows[0]?.n ?? 0;
}

export async function completeContract(id: string): Promise<void> {
  const rows = await sql`
    select max(session_date) as last from contract_sessions where contract_id = ${id}
  ` as { last: string | Date | null }[];
  const completedDate = toDateOnly(rows[0]?.last) ?? new Date().toISOString().slice(0, 10);
  await sql`update contracts set status = 'completed', completed_date = ${completedDate} where id = ${id}`;
}

// Flashcards -----------------------------------------------------------------

export interface DeckRow {
  id: string;
  /** Null on a coach library deck; set on a student's own copy. */
  student_id: string | null;
  name: string;
  source_deck_id: string | null;
  created_at: string;
}

export interface CardRow {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  example: string;
  box: number;
  due_date: string;
  created_at: string;
}

/** A deck plus the counts the list view shows, without loading its cards. */
export interface DeckSummary extends DeckRow {
  card_count: number;
  due_count: number;
  mastered_count: number;
}

function normalizeDeck<T extends DeckRow>(row: T): T {
  const createdAt = row.created_at as unknown;
  return { ...row, created_at: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt) };
}

function normalizeCard(row: CardRow): CardRow {
  const createdAt = row.created_at as unknown;
  return {
    ...row,
    due_date: toDateOnly(row.due_date)!,
    created_at: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt),
  };
}

/**
 * Decks for the list view, with the card counts rolled up in the same query --
 * one round trip regardless of how many decks a student has.
 */
export async function getDecksForStudent(studentId: string): Promise<DeckSummary[]> {
  const rows = await sql`
    select d.*,
           count(c.id)::int as card_count,
           count(c.id) filter (where c.due_date <= current_date)::int as due_count,
           count(c.id) filter (where c.box >= 5)::int as mastered_count
      from decks d
      left join cards c on c.deck_id = d.id
     where d.student_id = ${studentId}
     group by d.id
     order by d.created_at
  ` as DeckSummary[];
  return rows.map(normalizeDeck);
}

/** The coach's own library decks -- the ones with no owning student. */
export async function getLibraryDecks(): Promise<DeckSummary[]> {
  const rows = await sql`
    select d.*,
           count(c.id)::int as card_count,
           0::int as due_count,
           0::int as mastered_count
      from decks d
      left join cards c on c.deck_id = d.id
     where d.student_id is null
     group by d.id
     order by d.created_at
  ` as DeckSummary[];
  return rows.map(normalizeDeck);
}

export async function getDeckById(id: string): Promise<DeckRow | undefined> {
  const rows = await sql`select * from decks where id = ${id}` as DeckRow[];
  return rows[0] ? normalizeDeck(rows[0]) : undefined;
}

export async function getCardsForDeck(deckId: string): Promise<CardRow[]> {
  const rows = await sql`
    select * from cards where deck_id = ${deckId} order by created_at
  ` as CardRow[];
  return rows.map(normalizeCard);
}

/**
 * The student a card belongs to, resolved through its deck. Server actions use
 * this to prove ownership before touching a card, so knowing (or guessing) a
 * card id is never enough to reach another student's deck.
 */
export async function getCardOwner(cardId: string): Promise<{ student_id: string | null } | undefined> {
  const rows = await sql`
    select d.student_id
      from cards c join decks d on d.id = c.deck_id
     where c.id = ${cardId}
  ` as { student_id: string | null }[];
  return rows[0];
}

export async function createDeck(input: {
  studentId: string | null;
  name: string;
  sourceDeckId?: string | null;
}): Promise<DeckRow> {
  const id = newId('deck');
  const rows = await sql`
    insert into decks (id, student_id, name, source_deck_id)
    values (${id}, ${input.studentId}, ${input.name}, ${input.sourceDeckId ?? null})
    returning *
  ` as DeckRow[];
  return normalizeDeck(rows[0]);
}

export async function renameDeck(id: string, name: string): Promise<void> {
  await sql`update decks set name = ${name} where id = ${id}`;
}

export async function deleteDeck(id: string): Promise<void> {
  await sql`delete from decks where id = ${id}`;
}

export async function createCard(input: {
  deckId: string;
  front: string;
  back: string;
  example: string;
}): Promise<void> {
  await sql`
    insert into cards (id, deck_id, front, back, example)
    values (${newId('card')}, ${input.deckId}, ${input.front}, ${input.back}, ${input.example})
  `;
}

/**
 * Inserts a whole pasted batch in one statement. Unnesting parallel arrays
 * keeps a 500-card paste to a single round trip; looping over createCard
 * would be 500 of them.
 */
export async function createCards(deckId: string, cards: { front: string; back: string }[]): Promise<void> {
  if (cards.length === 0) return;
  const ids = cards.map(() => newId('card'));
  const fronts = cards.map((c) => c.front);
  const backs = cards.map((c) => c.back);
  await sql`
    insert into cards (id, deck_id, front, back)
    select u.id, ${deckId}, u.front, u.back
      from unnest(${ids}::text[], ${fronts}::text[], ${backs}::text[]) as u(id, front, back)
  `;
}

export async function updateCard(id: string, front: string, back: string, example: string): Promise<void> {
  await sql`update cards set front = ${front}, back = ${back}, example = ${example} where id = ${id}`;
}

export async function deleteCard(id: string): Promise<void> {
  await sql`delete from cards where id = ${id}`;
}

/**
 * Writes back a finished study session in one statement. Reviewing 40 cards
 * costs one round trip, not 40 -- the portal runs against a database that
 * suspends when idle, so per-card writes would be the expensive way to build
 * exactly the same feature.
 *
 * The deck_id guard means a tampered card id from another deck matches
 * nothing rather than updating a card the student doesn't own.
 */
export async function applyReviewResults(
  deckId: string,
  results: { id: string; box: number; dueDate: string }[]
): Promise<void> {
  if (results.length === 0) return;
  const ids = results.map((r) => r.id);
  const boxes = results.map((r) => r.box);
  const dues = results.map((r) => r.dueDate);
  await sql`
    update cards c
       set box = v.box, due_date = v.due_date
      from unnest(${ids}::text[], ${boxes}::int[], ${dues}::date[]) as v(id, box, due_date)
     where c.id = v.id and c.deck_id = ${deckId}
  `;
}

/**
 * Copies a library deck to a student. The copy is an ordinary student-owned
 * deck at fresh box/due values, so the student starts the material from
 * scratch, with source_deck_id recording where it came from.
 */
export async function copyDeckToStudent(sourceDeckId: string, studentId: string, name: string): Promise<void> {
  const deck = await createDeck({ studentId, name, sourceDeckId });
  await sql`
    insert into cards (id, deck_id, front, back, example)
    select 'card_' || replace(gen_random_uuid()::text, '-', ''), ${deck.id}, front, back, example
      from cards where deck_id = ${sourceDeckId}
  `;
}

/** Student ids already holding a copy of this library deck. */
export async function getDeckRecipients(sourceDeckId: string): Promise<string[]> {
  const rows = await sql`
    select distinct student_id from decks
     where source_deck_id = ${sourceDeckId} and student_id is not null
  ` as { student_id: string }[];
  return rows.map((r) => r.student_id);
}

/** Deck and card counts per student, for the coach's student panel. */
export async function getDeckCountsByStudent(): Promise<Record<string, { decks: number; cards: number }>> {
  const rows = await sql`
    select d.student_id,
           count(distinct d.id)::int as decks,
           count(c.id)::int as cards
      from decks d
      left join cards c on c.deck_id = d.id
     where d.student_id is not null
     group by d.student_id
  ` as { student_id: string; decks: number; cards: number }[];
  return Object.fromEntries(rows.map((r) => [r.student_id, { decks: r.decks, cards: r.cards }]));
}
