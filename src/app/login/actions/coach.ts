'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import {
  createStudent,
  deleteStudent,
  getStudentByCode,
  updateStudentCredentials,
  updateStudentNotes,
  createAssignment,
  deleteAssignment,
  getSettings,
  updateMasterPasswordHash,
  setSubmissionFeedback,
  createContract,
  updateContractDetails,
  replaceScheduleSlots,
  countSessionsBefore,
  deleteSessionsFrom,
  insertSessions,
  updateSessionDateTime,
  togglePaymentReceived,
  completeContract,
  newId,
  type AssignmentType,
} from '../lib/db';
import { genCode, genPassword, hashPassword, verifyPassword } from '../lib/auth';
import { generateInitialSessions, generateSessionsFrom, type ScheduleSlot } from '../lib/schedule';
import { requireCoach } from '../lib/session';
import { validateFile, sanitizeFilename } from '../lib/upload';

export interface AddStudentState {
  error: string;
  created: { id: string; name: string; code: string; password: string } | null;
}

export async function addStudent(
  _prevState: AddStudentState,
  formData: FormData
): Promise<AddStudentState> {
  await requireCoach();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Enter a name.', created: null };

  let code = genCode();
  while (await getStudentByCode(code)) code = genCode();
  const password = genPassword();
  const passwordHash = await hashPassword(password);

  const student = await createStudent(name, code, passwordHash);
  revalidatePath('/login/coach');
  // The plaintext password only ever exists here, in memory, right after
  // generation -- once hashed it can never be shown again, so this is the
  // one and only chance to hand it to the coach.
  return { error: '', created: { id: student.id, name: student.name, code, password } };
}

export async function removeStudent(studentId: string): Promise<void> {
  await requireCoach();
  await deleteStudent(studentId);
  revalidatePath('/login/coach');
}

export interface CredentialsState {
  error: string;
}

export async function saveCredentials(
  studentId: string,
  _prevState: CredentialsState,
  formData: FormData
): Promise<CredentialsState> {
  await requireCoach();
  const code = String(formData.get('code') ?? '').trim().toUpperCase();
  const password = String(formData.get('password') ?? '').trim();
  if (!code) return { error: 'Code is required.' };

  const clash = await getStudentByCode(code);
  if (clash && clash.id !== studentId) {
    return { error: `That code is already used by ${clash.name}. Choose a different one.` };
  }

  const passwordHash = password ? await hashPassword(password) : null;
  await updateStudentCredentials(studentId, code, passwordHash);
  revalidatePath('/login/coach');
  return { error: '' };
}

export interface AddAssignmentState {
  error: string;
}

export async function addAssignment(
  studentId: string,
  _prevState: AddAssignmentState,
  formData: FormData
): Promise<AddAssignmentState> {
  await requireCoach();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) return { error: 'Enter a title.' };

  const type = String(formData.get('type') ?? 'Homework') as AssignmentType;
  const description = String(formData.get('description') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const dueDate = String(formData.get('dueDate') ?? '').trim() || null;

  const file = formData.get('file');
  let fileUrl: string | null = null;
  let fileName: string | null = null;

  if (file instanceof File && file.size > 0) {
    const validationError = validateFile(file);
    if (validationError) return { error: validationError };

    const pathname = `assignments/${studentId}/${newId('f')}-${sanitizeFilename(file.name)}`;
    const blob = await put(pathname, file, { access: 'private', addRandomSuffix: false });
    fileUrl = blob.url;
    fileName = file.name;
  }

  await createAssignment({ studentId, title, type, description, url, fileUrl, fileName, dueDate });
  revalidatePath('/login/coach');
  return { error: '' };
}

export async function removeAssignment(assignmentId: string): Promise<void> {
  await requireCoach();
  await deleteAssignment(assignmentId);
  revalidatePath('/login/coach');
}

export interface ChangePasswordState {
  error: string;
  success: boolean;
}

export async function changeMasterPassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  await requireCoach();
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (!current || !next || !confirm) return { error: 'Fill in all fields.', success: false };
  if (next !== confirm) return { error: 'New passwords do not match.', success: false };
  if (next.length < 8) return { error: 'New password must be at least 8 characters.', success: false };

  const settings = await getSettings();
  const ok = await verifyPassword(current, settings.master_password_hash);
  if (!ok) return { error: 'Current password is incorrect.', success: false };

  const hash = await hashPassword(next);
  await updateMasterPasswordHash(hash);
  return { error: '', success: true };
}

export async function reviewSubmission(submissionId: string, formData: FormData): Promise<void> {
  await requireCoach();
  const feedback = String(formData.get('feedback') ?? '').trim();
  await setSubmissionFeedback(submissionId, feedback);
  revalidatePath('/login/coach');
}

export async function saveStudentNotes(studentId: string, formData: FormData): Promise<void> {
  await requireCoach();
  const notes = String(formData.get('notes') ?? '');
  await updateStudentNotes(studentId, notes);
  revalidatePath('/login/coach');
}

export interface ContractFormState {
  error: string;
}

const TIME_RE = /^\d{2}:\d{2}$/;

function parseSlotsFromForm(formData: FormData, count: number): ScheduleSlot[] | null {
  const slots: ScheduleSlot[] = [];
  for (let i = 0; i < count; i++) {
    const dayNum = Number(formData.get(`day_${i}`));
    const time = String(formData.get(`time_${i}`) ?? '');
    if (!Number.isInteger(dayNum) || dayNum < 0 || dayNum > 6) return null;
    if (!TIME_RE.test(time)) return null;
    slots.push({ dayOfWeek: dayNum, timeOfDay: time });
  }
  return slots;
}

// Creates a student's first contract, or the next one after a prior contract
// was completed. Requires a first-class date/time to anchor the generated
// session dates (see updateContractSchedule for mid-contract edits, which
// use today as the anchor instead).
export async function createContractForStudent(
  studentId: string,
  studentFirstName: string,
  _prevState: ContractFormState,
  formData: FormData
): Promise<ContractFormState> {
  await requireCoach();

  const weeklyClasses = Number(formData.get('weeklyClasses'));
  if (!Number.isInteger(weeklyClasses) || weeklyClasses < 1 || weeklyClasses > 14) {
    return { error: 'Weekly classes must be a whole number between 1 and 14.' };
  }
  const monthlyFee = String(formData.get('monthlyFee') ?? '').trim();
  if (!monthlyFee) return { error: 'Enter a monthly fee.' };

  const firstDate = String(formData.get('firstDate') ?? '');
  const firstTime = String(formData.get('firstTime') ?? '');
  if (!firstDate || !TIME_RE.test(firstTime)) return { error: 'Enter the date and time of the first class.' };

  const slots = parseSlotsFromForm(formData, weeklyClasses);
  if (!slots) return { error: 'Fill in a day and time for every weekly class.' };

  const sessions = generateInitialSessions(slots, firstDate, firstTime, weeklyClasses * 4);
  await createContract({ studentId, studentFirstName, weeklyClasses, monthlyFee, slots, sessions });
  revalidatePath('/login/coach');
  revalidatePath('/login/student');
  return { error: '' };
}

// Edits an active contract's weekly class count, schedule, or fee. Sessions
// that already happened are left untouched; everything from today onward is
// regenerated against the new pattern (per Brad's call on mid-contract edits).
export async function updateContractSchedule(
  contractId: string,
  _prevState: ContractFormState,
  formData: FormData
): Promise<ContractFormState> {
  await requireCoach();

  const weeklyClasses = Number(formData.get('weeklyClasses'));
  if (!Number.isInteger(weeklyClasses) || weeklyClasses < 1 || weeklyClasses > 14) {
    return { error: 'Weekly classes must be a whole number between 1 and 14.' };
  }
  const monthlyFee = String(formData.get('monthlyFee') ?? '').trim();
  if (!monthlyFee) return { error: 'Enter a monthly fee.' };

  const slots = parseSlotsFromForm(formData, weeklyClasses);
  if (!slots) return { error: 'Fill in a day and time for every weekly class.' };

  await updateContractDetails(contractId, weeklyClasses, monthlyFee);
  await replaceScheduleSlots(contractId, slots);

  const today = new Date().toISOString().slice(0, 10);
  const pastCount = await countSessionsBefore(contractId, today);
  const neededFuture = Math.max(0, weeklyClasses * 4 - pastCount);
  await deleteSessionsFrom(contractId, today);
  const newSessions = generateSessionsFrom(slots, today, neededFuture);
  await insertSessions(contractId, newSessions, pastCount);

  revalidatePath('/login/coach');
  revalidatePath('/login/student');
  return { error: '' };
}

export async function updateSession(sessionId: string, formData: FormData): Promise<void> {
  await requireCoach();
  const date = String(formData.get('date') ?? '');
  const time = String(formData.get('time') ?? '');
  if (!date || !TIME_RE.test(time)) return;
  await updateSessionDateTime(sessionId, date, time);
  revalidatePath('/login/coach');
  revalidatePath('/login/student');
}

export async function togglePayment(contractId: string, currentlyReceived: boolean): Promise<void> {
  await requireCoach();
  await togglePaymentReceived(contractId, !currentlyReceived);
  revalidatePath('/login/coach');
  revalidatePath('/login/student');
}

export async function finishContract(contractId: string): Promise<void> {
  await requireCoach();
  await completeContract(contractId);
  revalidatePath('/login/coach');
  revalidatePath('/login/student');
}
