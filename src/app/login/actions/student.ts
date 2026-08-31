'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getAssignmentById, setAssignmentStatus, createSubmission, updateStudentAvatar, newId } from '../lib/db';
import { requireStudent } from '../lib/session';
import { validateFile, sanitizeFilename } from '../lib/upload';
import { isValidAvatar } from '../lib/avatars';

/**
 * Students change only their own icon: the id comes from the session, never
 * from the caller, so this can't be pointed at another student.
 */
export async function changeMyAvatar(avatar: string): Promise<void> {
  const session = await requireStudent();
  if (avatar !== '' && !isValidAvatar(avatar)) return;
  await updateStudentAvatar(session.studentId, avatar);
  revalidatePath('/login/student');
  revalidatePath('/login/coach');
}

export async function toggleAssignment(assignmentId: string): Promise<void> {
  const session = await requireStudent();

  const assignment = await getAssignmentById(assignmentId);
  // Server-side ownership check -- a student must never be able to toggle
  // another student's assignment just by knowing/guessing its id.
  if (!assignment || assignment.student_id !== session.studentId) return;

  const nextStatus = assignment.status === 'completed' ? 'assigned' : 'completed';
  const completedDate = nextStatus === 'completed' ? new Date().toISOString().slice(0, 10) : null;
  await setAssignmentStatus(assignmentId, nextStatus, completedDate);
  revalidatePath('/login/student');
}

export interface SubmitWorkState {
  error: string;
  success: boolean;
}

export async function submitWork(
  _prevState: SubmitWorkState,
  formData: FormData
): Promise<SubmitWorkState> {
  const session = await requireStudent();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) return { error: 'Enter a title.', success: false };

  const bodyText = String(formData.get('text') ?? '').trim();
  const file = formData.get('file');

  let fileUrl: string | null = null;
  let fileName: string | null = null;

  if (file instanceof File && file.size > 0) {
    const validationError = validateFile(file);
    if (validationError) return { error: validationError, success: false };

    const pathname = `submissions/${session.studentId}/${newId('f')}-${sanitizeFilename(file.name)}`;
    const blob = await put(pathname, file, { access: 'private', addRandomSuffix: false });
    fileUrl = blob.url;
    fileName = file.name;
  }

  await createSubmission({ studentId: session.studentId, title, bodyText, fileUrl, fileName });
  revalidatePath('/login/student');
  return { error: '', success: true };
}
