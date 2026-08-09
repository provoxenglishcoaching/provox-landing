import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

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
  dueDate: string | null;
}): Promise<void> {
  const id = newId('as');
  await sql`
    insert into assignments (id, student_id, title, type, description, url, due_date)
    values (${id}, ${input.studentId}, ${input.title}, ${input.type}, ${input.description}, ${input.url}, ${input.dueDate})
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

export async function setSubmissionFeedback(id: string, feedback: string): Promise<void> {
  await sql`update submissions set coach_feedback = ${feedback}, status = 'reviewed' where id = ${id}`;
}
