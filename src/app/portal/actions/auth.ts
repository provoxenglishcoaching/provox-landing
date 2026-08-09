'use server';

import { redirect } from 'next/navigation';
import {
  getSettings,
  bootstrapMasterPassword,
  recordSettingsLoginResult,
  getStudentByCode,
  recordStudentLoginResult,
} from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/auth';
import { getSession } from '../lib/session';
import { isLocked, nextLockState, clearedLockState } from '../lib/rateLimit';

export interface LoginState {
  error: string;
}

const BAD_CREDS = "That code and password don't match. Check with your coach and try again.";
const LOCKED_MSG = 'Too many failed attempts. Please wait 15 minutes and try again.';

export async function login(_prevState: LoginState | null, formData: FormData): Promise<LoginState> {
  const code = String(formData.get('code') ?? '').trim().toUpperCase();
  const password = String(formData.get('password') ?? '').trim();

  if (!password) return { error: 'Enter a password.' };

  if (!code) {
    return loginAsCoach(password);
  }
  return loginAsStudent(code, password);
}

async function loginAsCoach(password: string): Promise<LoginState> {
  const settings = await getSettings();
  let hash = settings.master_password_hash;

  if (!hash) {
    const bootstrap = process.env.MASTER_PASSWORD;
    if (!bootstrap) return { error: 'Portal is not configured yet. Contact the site admin.' };
    hash = await hashPassword(bootstrap);
    await bootstrapMasterPassword(hash);
  }

  if (isLocked(settings.locked_until)) return { error: LOCKED_MSG };

  const ok = await verifyPassword(password, hash);
  if (!ok) {
    await recordSettingsLoginResult(nextLockState(settings.failed_attempts));
    return { error: BAD_CREDS };
  }

  await recordSettingsLoginResult(clearedLockState);
  const session = await getSession();
  session.role = 'coach';
  session.studentId = undefined;
  await session.save();
  redirect('/portal/coach');
}

async function loginAsStudent(code: string, password: string): Promise<LoginState> {
  const student = await getStudentByCode(code);
  if (!student) return { error: BAD_CREDS };

  if (isLocked(student.locked_until)) return { error: LOCKED_MSG };

  const ok = await verifyPassword(password, student.password_hash);
  if (!ok) {
    await recordStudentLoginResult(student.id, nextLockState(student.failed_attempts));
    return { error: BAD_CREDS };
  }

  await recordStudentLoginResult(student.id, clearedLockState);
  const session = await getSession();
  session.role = 'student';
  session.studentId = student.id;
  await session.save();
  redirect('/portal/student');
}

export async function logout(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect('/portal');
}
