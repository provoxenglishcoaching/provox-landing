'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import {
  createStudent,
  deleteStudent,
  getStudentByCode,
  updateStudentCredentials,
  createAssignment,
  deleteAssignment,
  getSettings,
  updateMasterPasswordHash,
  setSubmissionFeedback,
  newId,
  type AssignmentType,
} from '../lib/db';
import { genCode, genPassword, hashPassword, verifyPassword } from '../lib/auth';
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
  revalidatePath('/portal/coach');
  // The plaintext password only ever exists here, in memory, right after
  // generation -- once hashed it can never be shown again, so this is the
  // one and only chance to hand it to the coach.
  return { error: '', created: { id: student.id, name: student.name, code, password } };
}

export async function removeStudent(studentId: string): Promise<void> {
  await requireCoach();
  await deleteStudent(studentId);
  revalidatePath('/portal/coach');
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
  revalidatePath('/portal/coach');
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
  revalidatePath('/portal/coach');
  return { error: '' };
}

export async function removeAssignment(assignmentId: string): Promise<void> {
  await requireCoach();
  await deleteAssignment(assignmentId);
  revalidatePath('/portal/coach');
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
  revalidatePath('/portal/coach');
}
